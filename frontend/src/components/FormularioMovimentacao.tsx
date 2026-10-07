import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { movimentacaoApi } from '../api/api';
import { Produto, TipoMovimentacao } from '../types';

interface Props {
  produtos: Produto[];
  onMovimentacaoCriada: () => Promise<void>;
}

export function FormularioMovimentacao({ produtos, onMovimentacaoCriada }: Props) {
  const [produtoId, setProdutoId] = useState('');
  const [tipo, setTipo] = useState<TipoMovimentacao | ''>('');
  const [quantidade, setQuantidade] = useState('');
  const [erro, setErro] = useState('');

  async function handleSubmit() {
    const quantidadeNumerica = Number(quantidade);
    if (!produtoId || !tipo || !quantidade.trim()) {
      setErro('Preencha todos os campos.');
      return;
    }
    if (!Number.isInteger(quantidadeNumerica) || quantidadeNumerica <= 0) {
      setErro('Informe uma quantidade inteira maior que zero.');
      return;
    }

    try {
      setErro('');
      await movimentacaoApi.criar({
        produtoId: Number(produtoId),
        tipo,
        quantidade: quantidadeNumerica,
      });
      setProdutoId('');
      setTipo('');
      setQuantidade('');
      await onMovimentacaoCriada();
    } catch (error) {
      const resposta = error as { response?: { data?: { message?: string } } };
      setErro(resposta.response?.data?.message ?? 'Não foi possível registrar a movimentação.');
    }
  }

  return (
    <View style={styles.form}>
      <Text style={styles.titulo}>Registrar Movimentação</Text>
      <View style={styles.seletor}>
        <Picker selectedValue={produtoId} onValueChange={(valor) => setProdutoId(String(valor))}>
          <Picker.Item label="Selecione um produto" value="" />
          {produtos.map((produto) => (
            <Picker.Item
              key={produto.id}
              label={`${produto.nome} · Estoque atual: ${produto.quantidade} un.`}
              value={String(produto.id)}
            />
          ))}
        </Picker>
      </View>
      <View style={styles.seletor}>
        <Picker selectedValue={tipo} onValueChange={(valor) => setTipo(valor as TipoMovimentacao | '')}>
          <Picker.Item label="Selecione o tipo" value="" />
          <Picker.Item label="Entrada" value="ENTRADA" />
          <Picker.Item label="Saída" value="SAIDA" />
        </Picker>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="number-pad"
      />
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      <TouchableOpacity style={styles.botao} onPress={handleSubmit}>
        <Text style={styles.botaoTexto}>Registrar movimentação</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: 16 },
  titulo: { fontWeight: '600', fontSize: 18, marginBottom: 8 },
  seletor: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 8, overflow: 'hidden' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 8 },
  erro: { color: '#b91c1c', marginBottom: 8 },
  botao: { backgroundColor: '#2563eb', padding: 12, borderRadius: 6 },
  botaoTexto: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
