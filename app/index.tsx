import { Accelerometer } from "expo-sensors";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

const LEVEL_MAX_WIDTH = Math.min(width * 0.95, 360);
const LEVEL_HEIGHT = 72;
const BOLHA = 44;


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
  const TRACK_WIDTH = LEVEL_MAX_WIDTH - 24; // padding inside the level container
  const maxTranslate = (TRACK_WIDTH - BOLHA) / 2;
  // Map accelerometer x (-1..1) to translate range and clamp inside the track
  const translateX = Math.max(
    -maxTranslate,
    Math.min(maxTranslate, data.x * maxTranslate * 1.25)
  );

  return (
    <View style={styles.container}>
      <View style={[styles.levelContainer, { width: LEVEL_MAX_WIDTH, height: LEVEL_HEIGHT }]}
      >
        <View style={[styles.track, { width: TRACK_WIDTH, height: LEVEL_HEIGHT - 24 }]}> 
          <View style={styles.endCapLeft} />
          <View style={styles.centerMark} />
          <View style={styles.endCapRight} />

          <View
            style={[
              styles.bolha,
              {
                transform: [{ translateX }],
              },
            ]}
          />
        </View>
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
  levelContainer: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#444",
    backgroundColor: "#e9eef2",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  track: {
    backgroundColor: "#cfefff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  bolha: {
    position: "absolute",
    width: BOLHA,
    height: BOLHA,
    borderRadius: BOLHA / 2,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderWidth: 2,
    borderColor: "#a8d7ff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  endCapLeft: {
    position: "absolute",
    left: 6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ddd",
  },
  endCapRight: {
    position: "absolute",
    right: 6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ddd",
  },
  centerMark: {
    position: "absolute",
    width: 2,
    height: 28,
    backgroundColor: "#6aa6d6",
    borderRadius: 2,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
  },
});
