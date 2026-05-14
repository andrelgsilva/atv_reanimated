import { useEffect, useRef } from "react";
import { StyleSheet, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function DraggableItem({ item, zones }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const initialX = useSharedValue(0);
  const initialY = useSharedValue(0);

  const itemRef = useRef(null);

  // 📍 mede posição inicial corretamente
  useEffect(() => {
    setTimeout(() => {
      itemRef.current?.measure((x, y, width, height, pageX, pageY) => {
        initialX.value = pageX + width / 2;
        initialY.value = pageY + height / 2;
      });
    }, 100);
  }, []);

  const gesture = Gesture.Pan()
    .runOnJS(true) // 🔥 ESSENCIAL
    .onBegin(() => {
      scale.value = withSpring(1.1);
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      scale.value = withSpring(1);

      const finalX = initialX.value + event.translationX;
      const finalY = initialY.value + event.translationY;

      let encaixou = false;

      // 👍 GOSTO
      if (zones?.gosto) {
        const z = zones.gosto;

        if (
          finalX > z.x &&
          finalX < z.x + z.width &&
          finalY > z.y &&
          finalY < z.y + z.height
        ) {
          const centerX = z.x + z.width / 2;
          const centerY = z.y + z.height / 2;

          translateX.value = withSpring(centerX - initialX.value);
          translateY.value = withSpring(centerY - initialY.value);

          encaixou = true;
        }
      }

      // 👎 NÃO GOSTO
      if (zones?.naoGosto) {
        const z = zones.naoGosto;

        if (
          finalX > z.x &&
          finalX < z.x + z.width &&
          finalY > z.y &&
          finalY < z.y + z.height
        ) {
          const centerX = z.x + z.width / 2;
          const centerY = z.y + z.height / 2;

          translateX.value = withSpring(centerX - initialX.value);
          translateY.value = withSpring(centerY - initialY.value);

          encaixou = true;
        }
      }

      // ❌ volta se não encaixar
      if (!encaixou) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View ref={itemRef} style={[styles.item, animatedStyle]}>
        <Text style={styles.itemText}>{item}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  item: {
    width: 80,
    height: 80,
    backgroundColor: "#FF6B6B",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});