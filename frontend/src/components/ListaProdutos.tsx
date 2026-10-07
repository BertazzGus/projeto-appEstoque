import { StyleSheet, Text, View } from 'react-native';
import { Produto } from '../types';

interface Props {
  produtos: Produto[];
}

export function ListaProdutos({ produtos }: Props) {
  return (
    <View>
      <Text style={styles.titulo}>Produtos</Text>
      {produtos.length === 0 ? (
        <Text style={styles.vazio}>Nenhum produto cadastrado.</Text>
      ) : (
        produtos.map((produto) => (
          <View key={produto.id} style={styles.cartao}>
            <Text style={styles.nome}>{produto.nome}</Text>
            <Text style={styles.detalhe}>ID: {produto.id} · Categoria: {produto.categoria.nome}</Text>
            <Text style={styles.detalhe}>
              {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              {'  ·  '}Estoque: {produto.quantidade} un.
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  vazio: { color: '#666', marginBottom: 12 },
  cartao: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 12, marginBottom: 8 },
  nome: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  detalhe: { color: '#555', marginTop: 2 },
});
