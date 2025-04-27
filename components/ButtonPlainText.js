import { Text, TouchableOpacity } from "react-native";
import { useState } from "react";

export default function ButtonPlainText({ text, onPress }) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <Text
        style={{
          color: isPressed ? "#aaa" : "#000",
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
