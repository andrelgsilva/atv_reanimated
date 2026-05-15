// DraggableItem.jsx
import { StyleSheet, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useCallback, useEffect, useMemo, useRef } from "react";

export default function DraggableItem({
  item,
  zones,
  itemsState,
  setItemsState,
  originX = 0,
  originY = 0,
}) {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const scale = useSharedValue(1);

  const zonesRef = useRef(zones);
  const originXRef = useRef(originX);
  const originYRef = useRef(originY);

  useEffect(() => {
    originXRef.current = originX;
    originYRef.current = originY;
  }, [originX, originY]);

  useEffect(() => {
    zonesRef.current = zones;
  }, [zones]);

  const estado = itemsState[item];

  const updateState = useCallback(
    (novoEstado) => {
      setItemsState((prev) => ({ ...prev, [item]: novoEstado }));
    },
    [item]
  );

  useEffect(() => {
    if (!zones?.gosto || !zones?.naoGosto) return;

    if (estado === "none") {
      x.value = withSpring(0);
      y.value = withSpring(0);
      return;
    }

    const itemSize = 80;
    const gap = 10;
    const padding = 16;

    const itemsOrdenados = Object.entries(itemsState)
      .filter(([_, v]) => v === estado)
      .map(([key]) => key)
      .sort();

    const index = itemsOrdenados.indexOf(item);
    const col = index % 2;
    const row = Math.floor(index / 2);

    const z = estado === "gosto" ? zones.gosto : zones.naoGosto;
    const ox = originXRef.current;
    const oy = originYRef.current;

    x.value = withSpring(z.x + padding + col * (itemSize + gap) - ox);
    y.value = withSpring(z.y + padding + row * (itemSize + gap) - oy);

  }, [estado, itemsState, zones]);

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(() => {
          offsetX.value = x.value;
          offsetY.value = y.value;
          scale.value = withSpring(1.1);
        })
        .onUpdate((e) => {
          x.value = offsetX.value + e.translationX;
          y.value = offsetY.value + e.translationY;
        })
        .onEnd((e) => {
          scale.value = withSpring(1);

          const z = zonesRef.current;
          let novoEstado = "none";

          const dentro = (zona) => {
            return (
              e.absoluteX >= zona.x &&
              e.absoluteX <= zona.x + zona.width &&
              e.absoluteY >= zona.y &&
              e.absoluteY <= zona.y + zona.height
            );
          };

          if (z?.gosto && dentro(z.gosto)) {
            novoEstado = "gosto";
          } else if (z?.naoGosto && dentro(z.naoGosto)) {
            novoEstado = "naoGosto";
          }

          runOnJS(updateState)(novoEstado);
        }),
    []
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
    ],
    backgroundColor:
      estado === "gosto"
        ? "#4CAF50"
        : estado === "naoGosto"
        ? "#F44336"
        : "#B0B0B0",
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.item, animatedStyle]}>
        <Text style={styles.text}>{item}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  item: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 11,
    textAlign: "center",
  },
});