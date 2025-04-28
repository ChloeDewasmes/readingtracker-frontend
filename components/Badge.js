import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const gradientColors = {
  1: ["#FF512F", "#F09819", "#FFD700"], // gradient 1
  2: ["#FF6EC7", "#8E2DE2", "#4A00E0"], // gradient 2
  3: ["#00F5A0", "#00D9F5"], // gradient 3
};

const Badge = ({ gradient = 1, iconName, number, size = 80, label }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors[gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.badge,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <MaterialCommunityIcons
          name={iconName}
          size={size / 2.5}
          color="white"
        />
        {number !== undefined && (
          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>{number}</Text>
          </View>
        )}
      </LinearGradient>
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    margin: 10,
  },
  badge: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  numberContainer: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  numberText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    textAlign: "center",
  },
});

export default Badge;
