import { adicionarTarefa, getTarefas } from "@/back4app";
import { useTaskFilter } from "@/zustand";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

export default function TarefasPage() {
  const isEnabled = useTaskFilter((state) => state.isEnabled);
  const toggleSwitch = useTaskFilter((state) => state.toggleSwitch);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isFetching } = useQuery({
    queryKey: ["tarefas"],
    queryFn: getTarefas,
  });
  const mutation = useMutation({
    mutationFn: adicionarTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
    },
  });
  const [descricao, setDescricao] = useState("");
  const tasks = isEnabled ? data?.filter((t) => !t.concluida) : data;

  async function handleAdicionarTarefaPress() {
    if (descricao.trim() === "") {
      Alert.alert("Descrição inválida", "Preencha a descrição da tarefa", [
        { text: "OK", onPress: () => {} },
      ]);
      return;
    }
    mutation.mutate({ descricao });
    setDescricao("");
  }

  return (
    <View style={styles.container}>
      {(isFetching || mutation.isPending) && <ActivityIndicator size="large" />}
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />
      <Button
        title="Adicionar Tarefa"
        onPress={handleAdicionarTarefaPress}
        disabled={mutation.isPending}
      />
      <View style={styles.hr} />
      <View style={styles.switchContainer}>
        <Text>Filtrar as concluídas: </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      <View style={styles.hr} />
      <View style={styles.tasksContainer}>
        {tasks?.map((t) => (
          <Pressable
            key={t.objectId}
            onPress={() => router.push(`/tarefas/${t.objectId}`)}
          >
            <Text style={t.concluida && styles.strikethroughText}>
              {t.descricao}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  tasksContainer: {
    paddingLeft: 15,
  },
  input: {
    borderColor: "black",
    borderWidth: 1,
    width: "90%",
    marginBottom: 5,
  },
  hr: {
    height: 1,
    backgroundColor: "black",
    width: "95%",
    marginVertical: 10,
  },
  strikethroughText: {
    textDecorationLine: "line-through", // Key property for strikethrough
    textDecorationStyle: "solid", // Optional: Style of the line
    textDecorationColor: "red", // Optional: Color of the line (iOS only)
    // Other styles like fontSize, fontWeight, color can also be applied
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
    paddingHorizontal: 10,
  },
});
