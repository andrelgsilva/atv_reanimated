import { StyleSheet, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useCallback, useMemo } from "react";

export default function DraggableItem({
  item,
  zones,
  itemsState,
  setItemsState,
}) {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const scale = useSharedValue(1);

  // função otimizada
  const updateState = useCallback(
    (novoEstado) => {
      setItemsState((prev) => ({ ...prev, [item]: novoEstado }));
    },
    [item, setItemsState]
  );

  // gesture otimizado
  const gesture = useMemo(() => {
    return Gesture.Pan()
      .onBegin(() => {
        scale.value = withSpring(1.1);
      })
      .onUpdate((e) => {
        x.value = e.translationX;
        y.value = e.translationY;
      })
      .onEnd((e) => {
        scale.value = withSpring(1);

        let novoEstado = "none";

        if (zones?.naoGosto) {
          const z = zones.naoGosto;
          if (
            e.absoluteX > z.x &&
            e.absoluteX < z.x + z.width &&
            e.absoluteY > z.y &&
            e.absoluteY < z.y + z.height
          ) {
            novoEstado = "naoGosto";
          }
        }

        if (zones?.gosto) {
          const z = zones.gosto;
          if (
            e.absoluteX > z.x &&
            e.absoluteX < z.x + z.width &&
            e.absoluteY > z.y &&
            e.absoluteY < z.y + z.height
          ) {
            novoEstado = "gosto";
          }
        }

        runOnJS(updateState)(novoEstado);

        x.value = withSpring(0);
        y.value = withSpring(0);
      });
  }, [zones, updateState]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
    ],
  }));

  const estado = itemsState[item];

  const bgColor =
    estado === "gosto"
      ? "#4CAF50"
      : estado === "naoGosto"
      ? "#F44336"
      : "#B0B0B0";

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.item,
          animatedStyle,
          { backgroundColor: bgColor },
        ]}
      >
        <Text style={styles.text}>{item}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  item: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    zIndex: 1,
    elevation: 1,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 11,
  },
});