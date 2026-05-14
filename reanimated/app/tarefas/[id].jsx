import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { atualizarTarefa, getTarefa, removerTarefa } from "@/back4app";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TarefaDetalhesPage() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: tarefa, isLoading } = useQuery({
    queryKey: ["tarefa", id],
    queryFn: () => getTarefa(id),
  });

  const updateMutation = useMutation({
    mutationFn: atualizarTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
      queryClient.invalidateQueries({ queryKey: ["tarefa", id] });
      Alert.alert("Sucesso", "Tarefa atualizada com sucesso!");
      router.back();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: removerTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
      Alert.alert("Sucesso", "Tarefa removida com sucesso!");
      router.back();
    },
  });

  const [descricao, setDescricao] = useState("");
  const [concluida, setConcluida] = useState(false);

  useEffect(() => {
    if (tarefa) {
      setDescricao(tarefa.descricao);
      setConcluida(tarefa.concluida || false);
    }
  }, [tarefa]);

  function handleUpdate() {
    if (descricao.trim() === "") {
      Alert.alert("Erro", "A descrição não pode estar vazia.");
      return;
    }
    updateMutation.mutate({ id: id, descricao, concluida });
  }

  function handleDelete() {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta tarefa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => deleteMutation.mutate(id),
        },
      ],
    );
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: `Tarefa #${id}` }} />
      <View style={[styles.container, { paddingBottom: insets.bottom + 20 }]}>
        <Text style={styles.label}>Descrição:</Text>
        <TextInput
          style={styles.input}
          value={descricao}
          onChangeText={setDescricao}
        />

        <View style={styles.row}>
          <Text style={styles.label}>Concluída:</Text>
          <Switch value={concluida} onValueChange={setConcluida} />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Salvar Alterações"
            onPress={handleUpdate}
            disabled={updateMutation.isPending}
          />
          <View style={{ height: 10 }} />
          <Button
            title="Excluir Tarefa"
            onPress={handleDelete}
            color="red"
            disabled={deleteMutation.isPending}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  buttonContainer: {
    marginTop: "auto",
  },
});
