import { useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BotaoSair } from '../components/BotaoSair';
import { FormularioProduto } from '../components/FormularioProduto';
import { ListaProdutos } from '../components/ListaProdutos';
import { categoriaApi, produtoApi } from '../api/api';
import { Categoria, Produto } from '../types';

export function ProdutosScreen() {
  const navigation = useNavigation();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerRight: () => <BotaoSair /> });
  }, [navigation]);

  async function carregar() {
    const [listaProdutos, listaCategorias] = await Promise.all([
      produtoApi.listar(),
      categoriaApi.listar(),
    ]);
    setProdutos(listaProdutos);
    setCategorias(listaCategorias);
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <ListaProdutos produtos={produtos} />
        <FormularioProduto categorias={categorias} onProdutoCriado={carregar} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
});
