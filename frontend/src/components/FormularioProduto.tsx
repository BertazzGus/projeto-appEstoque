import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { produtoApi } from '../api/api';
import { Categoria } from '../types';

interface Props {
  categorias: Categoria[];
  onProdutoCriado: () => Promise<void>;
}

export function FormularioProduto({ categorias, onProdutoCriado }: Props) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [erro, setErro] = useState('');

  async function handleSubmit() {
    const nomeLimpo = nome.trim();
    const precoNumerico = Number(preco.replace(',', '.'));
    const quantidadeNumerica = Number(quantidade);
    if (!nomeLimpo || !preco.trim() || !quantidade.trim() || !categoriaId) {
      setErro('Preencha todos os campos.');
      return;
    }
    if (!Number.isFinite(precoNumerico) || precoNumerico < 0 || !Number.isInteger(quantidadeNumerica) || quantidadeNumerica < 0) {
      setErro('Informe um preço e uma quantidade válidos.');
      return;
    }

    try {
      setErro('');
      await produtoApi.criar({
        nome: nomeLimpo,
        preco: precoNumerico,
        quantidade: quantidadeNumerica,
        categoriaId: Number(categoriaId),
      });
      setNome('');
      setPreco('');
      setQuantidade('');
      setCategoriaId('');
      await onProdutoCriado();
    } catch {
      setErro('Não foi possível cadastrar o produto.');
    }
  }

  return (
    <View style={styles.form}>
      <Text style={styles.titulo}>Novo Produto</Text>
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput
        style={styles.input}
        placeholder="Preço (R$)"
        value={preco}
        onChangeText={setPreco}
        keyboardType="decimal-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade inicial"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="number-pad"
      />
      <View style={styles.seletor}>
        <Picker selectedValue={categoriaId} onValueChange={(valor) => setCategoriaId(String(valor))}>
          <Picker.Item label="Selecione uma categoria" value="" />
          {categorias.map((categoria) => (
            <Picker.Item key={categoria.id} label={categoria.nome} value={String(categoria.id)} />
          ))}
        </Picker>
      </View>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      <TouchableOpacity style={styles.botao} onPress={handleSubmit}>
        <Text style={styles.botaoTexto}>Cadastrar produto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: 16 },
  titulo: { fontWeight: '600', fontSize: 18, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 8 },
  seletor: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 8, overflow: 'hidden' },
  erro: { color: '#b91c1c', marginBottom: 8 },
  botao: { backgroundColor: '#2563eb', padding: 12, borderRadius: 6 },
  botaoTexto: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
