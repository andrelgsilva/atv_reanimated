import DraggableItem from "@/components/DraggableItem";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRef, useState } from "react";

export default function GostoNaoGosto() {
  const items = ["Maçã", "Banana", "Laranja", "Uva", "Abacate", "Pera"];

  const gostoRef = useRef(null);
  const naoGostoRef = useRef(null);

  const [zones, setZones] = useState({ gosto: null, naoGosto: null });
  const [itemsState, setItemsState] = useState({});

  const medirZonas = () => {
    gostoRef.current?.measureInWindow((x, y, width, height) => {
      setZones((prev) => ({
        ...prev,
        gosto: { x, y, width, height },
      }));
    });

    naoGostoRef.current?.measureInWindow((x, y, width, height) => {
      setZones((prev) => ({
        ...prev,
        naoGosto: { x, y, width, height },
      }));
    });
  };

  const gostoCount = Object.values(itemsState).filter(
    (v) => v === "gosto"
  ).length;

  const naoGostoCount = Object.values(itemsState).filter(
    (v) => v === "naoGosto"
  ).length;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Arraste os itens</Text>

        <View style={styles.itemsArea}>
          {items.map((item) => (
            <DraggableItem
              key={item}
              item={item}
              zones={zones}
              itemsState={itemsState}
              setItemsState={setItemsState}
            />
          ))}
        </View>

        <View style={styles.zones}>
          <View
            style={[styles.zone, { backgroundColor: "#FFE3E3" }]}
            ref={naoGostoRef}
            onLayout={medirZonas}
          >
            <Text style={styles.zoneText}>Nao gosto</Text>

            {naoGostoCount > 0 && (
              <Text style={styles.zoneCount}>
                {naoGostoCount} item(s)
              </Text>
            )}
          </View>

          <View
            style={[styles.zone, { backgroundColor: "#C7F9CC" }]}
            ref={gostoRef}
            onLayout={medirZonas}
          >
            <Text style={styles.zoneText}>Gosto</Text>

            {gostoCount > 0 && (
              <Text style={styles.zoneCount}>
                {gostoCount} item(s)
              </Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  title: {
    textAlign: "center",
    fontSize: 22,
    marginVertical: 10,
    fontWeight: "bold",
  },

  itemsArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 10,
    minHeight: 200,
  },

  zones: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
    paddingHorizontal: 10,
    paddingBottom: 20,

    // zonas ficam acima dos itens
    zIndex: 10,
    elevation: 10,
  },

  zone: {
    width: 150,
    height: 200,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ddd",
  },

  zoneText: {
    fontWeight: "bold",
    fontSize: 14,
  },

  zoneCount: {
    marginTop: 8,
    fontSize: 12,
    color: "#555",
  },
});