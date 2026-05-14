import DraggableItem from "@/components/DraggableItem";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRef, useState } from "react";

export default function GostoNaoGosto() {
  const items = ["Maçã", "Banana", "Laranja", "Uva", "Abacate", "Pera"];

  const gostoRef = useRef(null);
  const naoGostoRef = useRef(null);

  const [zones, setZones] = useState({
    gosto: null,
    naoGosto: null,
  });

  const medirZonas = () => {
    requestAnimationFrame(() => {
      if (!gostoRef.current || !naoGostoRef.current) return;

      gostoRef.current.measure((x, y, width, height, pageX, pageY) => {
        naoGostoRef.current.measure(
          (x2, y2, width2, height2, pageX2, pageY2) => {
            setZones({
              gosto: { x: pageX, y: pageY, width, height },
              naoGosto: {
                x: pageX2,
                y: pageY2,
                width: width2,
                height: height2,
              },
            });
          }
        );
      });
    });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Arraste para Gosto ou Não Gosto</Text>

        <View style={styles.dragArea}>
          {items.map((item, index) => (
            <DraggableItem key={index} item={item} zones={zones} />
          ))}
        </View>

        <View style={styles.dropZones} onLayout={medirZonas}>
          <View style={styles.dropZone} ref={gostoRef}>
            <Text style={styles.zoneTitle}>Gosto</Text>
          </View>

          <View
            style={[styles.dropZone, { backgroundColor: "#FFE66D" }]}
            ref={naoGostoRef}
          >
            <Text style={styles.zoneTitle}>Não Gosto</Text>
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  safeArea: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  dragArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  dropZones: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  dropZone: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: "#A8E6CF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 150,
    elevation: 3,
  },
  zoneTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});