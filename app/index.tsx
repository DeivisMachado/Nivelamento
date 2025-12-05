import { Accelerometer } from "expo-sensors";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

const CIRCULO_GRANDE = 250;
const BOLHA = 50;


export default function Index() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState<any>(null);

  const _subscribe = () => {
    const sub = Accelerometer.setUpdateInterval(16);
    setSubscription(
      Accelerometer.addListener((accelerometerData) => {
        setData(accelerometerData);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => {
      _unsubscribe();
    };
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.circuloGrande}>
        <View
          style={[
            styles.bolha,
            {
              transform: [
                { translateX: data.x * 100 },
                { translateY: data.y * 100 },
              ],
            },
          ]}
        />
      </View>
      <Text style={styles.text}>
        x: {data.x.toFixed(2)}, y: {data.y.toFixed(2)}, z: {data.z.toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  circuloGrande: {
    width: CIRCULO_GRANDE,
    height: CIRCULO_GRANDE,
    borderRadius: CIRCULO_GRANDE / 2,
    borderWidth: 2,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  bolha: {
    width: BOLHA,
    height: BOLHA,
    borderRadius: BOLHA / 2,
    backgroundColor: "red",
  },
  text: {
    marginTop: 20,
    fontSize: 18,
  },
});
