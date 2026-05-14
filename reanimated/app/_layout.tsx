import 'react-native-gesture-handler';
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="index" options={{ title: "Home" }} />
          <Stack.Screen name="about" options={{ title: "--- Sobre ---" }} />
          <Stack.Screen name="tarefas/index" options={{ title: "Tarefas" }} />
          <Stack.Screen name="gostoNaoGosto" options={{ title: "Gosto / Não Gosto" }} />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}