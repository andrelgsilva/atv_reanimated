import { Button, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function App() {
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  const handlePress = () => {
    translateX.value = (translateX.value + 50) % 200;
    rotate.value += 35;
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: withSpring(translateX.value * 2) },
      { rotate: withSpring(`${rotate.value}deg`) },
    ],
  }));

  return (
    <>
      <Animated.View style={[styles.box, animatedStyles]} />
      <View style={styles.container}>
        <Button onPress={handlePress} title="Click me" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    height: 120,
    width: 120,
    backgroundColor: "#b58df1",
    borderRadius: 20,
    marginVertical: 50,
  },
});
