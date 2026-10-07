import { useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BotaoSair } from '../components/BotaoSair';
import { FormularioMovimentacao } from '../components/FormularioMovimentacao';
import { ListaMovimentacoes } from '../components/ListaMovimentacoes';
import { movimentacaoApi, produtoApi } from '../api/api';
import { Movimentacao, Produto } from '../types';

export function MovimentacoesScreen() {
  const navigation = useNavigation();
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerRight: () => <BotaoSair /> });
  }, [navigation]);

  async function carregar() {
    const [listaMovimentacoes, listaProdutos] = await Promise.all([
      movimentacaoApi.listar(),
      produtoApi.listar(),
    ]);
    setMovimentacoes(listaMovimentacoes);
    setProdutos(listaProdutos);
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <ListaMovimentacoes movimentacoes={movimentacoes} />
        <FormularioMovimentacao produtos={produtos} onMovimentacaoCriada={carregar} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
});
