// GostoNaoGosto.jsx
import DraggableItem from "@/components/DraggableItem";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRef, useState } from "react";

const ITEMS = ["Maca", "Banana", "Laranja", "Uva", "Abacate", "Pera"];

export default function GostoNaoGosto() {
  const gostoRef = useRef(null);
  const naoGostoRef = useRef(null);
  const itemRefs = useRef(Object.fromEntries(ITEMS.map((item) => [item, null])));

  const [zones, setZones] = useState({ gosto: null, naoGosto: null });
  const [itemsState, setItemsState] = useState(
    Object.fromEntries(ITEMS.map((item) => [item, "none"]))
  );
  const [itemOrigins, setItemOrigins] = useState({});

  const medirZonas = () => {
    setTimeout(() => {
      gostoRef.current?.measureInWindow((x1, y1, w1, h1) => {
        naoGostoRef.current?.measureInWindow((x2, y2, w2, h2) => {
          setZones({
            gosto: { x: x1, y: y1, width: w1, height: h1 },
            naoGosto: { x: x2, y: y2, width: w2, height: h2 },
          });

          ITEMS.forEach((item) => {
            itemRefs.current[item]?.measureInWindow((x, y) => {
              setItemOrigins((prev) => ({ ...prev, [item]: { x, y } }));
            });
          });
        });
      });
    }, 100);
  };

  const gostoCount = Object.values(itemsState).filter((v) => v === "gosto").length;
  const naoGostoCount = Object.values(itemsState).filter((v) => v === "naoGosto").length;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Arraste os itens</Text>

        <View style={styles.itemsArea}>
          {ITEMS.map((item) => (
            <View
              key={item}
              style={styles.itemSlot}
              ref={(r) => { itemRefs.current[item] = r; }}
              onLayout={() => {
                setTimeout(() => {
                  itemRefs.current[item]?.measureInWindow((x, y) => {
                    setItemOrigins((prev) => {
                      if (prev[item]?.x === x && prev[item]?.y === y) return prev;
                      return { ...prev, [item]: { x, y } };
                    });
                  });
                }, 50);
              }}
            >
              {itemOrigins[item] && zones.gosto && zones.naoGosto ? (
                <DraggableItem
                  item={item}
                  zones={zones}
                  itemsState={itemsState}
                  setItemsState={setItemsState}
                  originX={itemOrigins[item].x}
                  originY={itemOrigins[item].y}
                />
              ) : null}
            </View>
          ))}
        </View>

        <View style={styles.zones}>

          {/* NÃO GOSTO */}
          <View style={styles.zoneWrapper}>
            <Text style={styles.zoneTitle}>Nao gosto</Text>
            <Text style={styles.zoneCount}>{naoGostoCount} item(s)</Text>

            <View
              style={[styles.zone, { backgroundColor: "#FFE3E3" }]}
              ref={naoGostoRef}
              onLayout={medirZonas}
            />
          </View>

          {/* GOSTO */}
          <View style={styles.zoneWrapper}>
            <Text style={styles.zoneTitle}>Gosto</Text>
            <Text style={styles.zoneCount}>{gostoCount} item(s)</Text>

            <View
              style={[styles.zone, { backgroundColor: "#C7F9CC" }]}
              ref={gostoRef}
              onLayout={medirZonas}
            />
          </View>

        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
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
  },
  itemSlot: {
    width: 80,
    height: 80,
    margin: 5,
  },
  zones: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  zoneWrapper: {
    alignItems: "center",
  },
  zoneTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  zoneCount: {
    fontSize: 13,
    color: "#555",
    marginBottom: 8,
  },
  zone: {
    width: 200,
    height: 300,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
  },
});