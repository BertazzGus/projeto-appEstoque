import { StyleSheet, Text, View } from 'react-native';
import { Movimentacao } from '../types';

interface Props {
  movimentacoes: Movimentacao[];
}

export function ListaMovimentacoes({ movimentacoes }: Props) {
  return (
    <View>
      <Text style={styles.titulo}>Histórico de Movimentações</Text>
      {movimentacoes.length === 0 ? (
        <Text style={styles.vazio}>Nenhuma movimentação registrada.</Text>
      ) : (
        movimentacoes.map((movimentacao) => {
          const entrada = movimentacao.tipo === 'ENTRADA';
          return (
            <View key={movimentacao.id} style={styles.cartao}>
              <View style={styles.cabecalho}>
                <Text style={styles.nome}>{movimentacao.produto.nome}</Text>
                <Text style={[styles.tipo, entrada ? styles.entrada : styles.saida]}>
                  {entrada ? 'Entrada' : 'Saída'}
                </Text>
              </View>
              <Text style={styles.detalhe}>{new Date(movimentacao.criadoEm).toLocaleString('pt-BR')}</Text>
              <Text style={styles.detalhe}>Quantidade: {movimentacao.quantidade} un.</Text>
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  vazio: { color: '#666', marginBottom: 12 },
  cartao: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 12, marginBottom: 8 },
  cabecalho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nome: { fontSize: 16, fontWeight: '600' },
  tipo: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, fontWeight: '600' },
  entrada: { backgroundColor: '#dcfce7', color: '#166534' },
  saida: { backgroundColor: '#fee2e2', color: '#991b1b' },
  detalhe: { color: '#555', marginTop: 6 },
});
