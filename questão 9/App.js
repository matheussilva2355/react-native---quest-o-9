import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  ScrollView, 
  Alert,
  Platform 
} from 'react-native';

export default function App() {
  // Lista de produtos disponíveis na lanchonete (pelo menos 4 produtos com nome e preço)[cite: 14]
  const cardapio = [
    { id: '1', nome: 'Sanduíche', preco: 8.00 },
    { id: '2', nome: 'Suco', preco: 5.00 },
    { id: '3', nome: 'Salgado', preco: 6.00 },
    { id: '4', nome: 'Café', preco: 4.00 }
  ];

  const [produtoSelecionado, setProdutoSelecionado] = useState(cardapio[0]);
  const [quantidade, setQuantidade] = useState('1');
  
  // Itens do pedido armazenados como objetos em array[cite: 14]
  const [pedido, setPedido] = useState([]);

  const adicionarAoPedido = () => {
    const qtd = parseInt(quantidade, 10);

    if (isNaN(qtd) || qtd <= 0) {
      Alert.alert('Quantidade inválida', 'Informe uma quantidade válida maior que zero.');
      return;
    }

    // Verifica se o produto já está no pedido para atualizar ou adicionar um novo item
    const indexExistente = pedido.findIndex(item => item.id === produtoSelecionado.id);

    if (indexExistente >= 0) {
      const novoPedido = [...pedido];
      novoPedido[indexExistente].quantidade += qtd;
      novoPedido[indexExistente].subtotal = novoPedido[indexExistente].quantidade * novoPedido[indexExistente].preco;
      setPedido(novoPedido);
    } else {
      const novoItem = {
        id: produtoSelecionado.id,
        nome: produtoSelecionado.nome,
        preco: produtoSelecionado.preco,
        quantidade: qtd,
        subtotal: produtoSelecionado.preco * qtd
      };
      setPedido([...pedido, novoItem]);
    }

    setQuantidade('1');
    Alert.alert('Sucesso', `${qtd}x ${produtoSelecionado.nome} adicionado(s) ao pedido.`);
  };

  const removerItem = (id) => {
    const pedidoAtualizado = pedido.filter(item => item.id !== id);
    setPedido(pedidoAtualizado);
  };

  // Cálculo do total geral do pedido[cite: 14]
  const totalGeral = pedido.reduce((soma, item) => soma + item.subtotal, 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Lanchonete Universitária</Text>
      <Text style={styles.subtitulo}>Montagem e Gestão de Pedidos</Text>

      {/* Seleção de Produtos */}
      <View style={styles.formGroup}>
        <Text style={styles.secaoTitulo}>Cardápio Disponível</Text>
        <View style={styles.cardapioContainer}>
          {cardapio.map((prod) => (
            <TouchableOpacity 
              key={prod.id} 
              style={[styles.produtoCard, produtoSelecionado.id === prod.id && styles.produtoAtivo]}
              onPress={() => setProdutoSelecionado(prod)}
            >
              <Text style={[styles.produtoNome, produtoSelecionado.id === prod.id && styles.textoAtivo]}>{prod.nome}</Text>
              <Text style={[styles.produtoPreco, produtoSelecionado.id === prod.id && styles.textoAtivo]}>R$ {prod.preco.toFixed(2)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Quantidade:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 2"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={quantidade}
          onChangeText={setQuantidade}
        />

        <TouchableOpacity style={styles.botaoAdicionar} onPress={adicionarAoPedido}>
          <Text style={styles.textoBotao}>Adicionar ao Pedido</Text>
        </TouchableOpacity>
      </View>

      {/* Resumo do Pedido */}
      <View style={styles.cardResumo}>
        <Text style={styles.secaoTitulo}>Resumo do Pedido</Text>

        {pedido.length === 0 ? (
          <Text style={styles.vazioTexto}>Nenhum item adicionado ao pedido ainda.</Text>
        ) : (
          <>
            {pedido.map((item) => (
              <View key={item.id} style={styles.itemCarrinho}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitulo}>{item.quantidade}x {item.nome}</Text>
                  <Text style={styles.itemSubtotal}>Subtotal: R$ {item.subtotal.toFixed(2)}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.botaoRemover} 
                  onPress={() => removerItem(item.id)}
                >
                  <Text style={styles.textoBotaoRemover}>Remover</Text>
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.totalContainer}>
              <Text style={styles.totalTexto}>Total Geral:</Text>
              <Text style={styles.totalValor}>R$ {totalGeral.toFixed(2)}</Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f4f6f8',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
    marginTop: 20,
  },
  subtitulo: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  formGroup: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  cardapioContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  produtoCard: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fafafa',
    alignItems: 'center',
  },
  produtoAtivo: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  produtoNome: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  produtoPreco: {
    fontSize: 14,
    color: '#666',
  },
  textoAtivo: {
    color: '#fff',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginBottom: 15,
    color: '#333',
  },
  botaoAdicionar: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardResumo: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e1e4e8',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  vazioTexto: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    marginTop: 10,
  },
  itemCarrinho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  itemSubtotal: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  botaoRemover: {
    backgroundColor: '#dc3545',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  textoBotaoRemover: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#e1e4e8',
  },
  totalTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
  },
});