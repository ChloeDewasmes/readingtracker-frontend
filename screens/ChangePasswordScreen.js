import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import globalStyles from "../globalStyles";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function ChangePasswordScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authenticationError, setAuthenticationError] = useState(Boolean);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  //route modif pwd
  const handleChangePassword = async () => {
    console.log("modif");
    //récup token asyncStorage
  };

  // Show passwords
  const toggleShowPassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon
              icon={faArrowLeft}
              size={18}
              style={{ color: "#56ADDB" }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 2, alignItems: "center" }}>
          {/* flex: 2 prends les 2/4 (la moitié) de l'écran  */}
          <Text style={[globalStyles.title1, { textAlign: "center" }]}>
            Modification du mot de passe
          </Text>
        </View>

        <View style={{ flex: 1 }} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.title}>Ancien mot de passe</Text>
        <View style={globalStyles.border}>
          <Ionicons name="lock-closed-outline" size={24} color="#BBC3FF" />
          <TextInput
            placeholder="Ancien mot de passe"
            textContentType="password"
            secureTextEntry={!showPasswords.old}
            onChangeText={(value) => setPassword(value)}
            value={password}
            style={styles.input}
          />
          <MaterialCommunityIcons
            name={showPasswords.old ? "eye-off" : "eye"}
            size={24}
            color="#BBC3FF"
            style={styles.icon}
            onPress={() => toggleShowPassword("old")}
          />
        </View>
        <Text style={styles.title}>Nouveau mot de passe</Text>
        <View style={globalStyles.border}>
          <TextInput
            placeholder="Nouveau mot de passe"
            textContentType="password"
            secureTextEntry={!showPasswords.new}
            onChangeText={(value) => setNewPassword(value)}
            value={newPassword}
            style={styles.input}
          />
          <MaterialCommunityIcons
            name={showPasswords.new ? "eye-off" : "eye"}
            size={24}
            color="#BBC3FF"
            style={styles.icon}
            onPress={() => toggleShowPassword("new")}
          />
        </View>
        <Text style={styles.title}>Confirmer le mot de passe</Text>
        <View style={globalStyles.border}>
          <TextInput
            placeholder="Confirmer le mot de passe"
            textContentType="password"
            secureTextEntry={!showPasswords.confirm}
            onChangeText={(value) => setConfirmedPassword(value)}
            value={confirmedPassword}
            style={styles.input}
          />
          <MaterialCommunityIcons
            name={showPasswords.confirm ? "eye-off" : "eye"}
            size={24}
            color="#BBC3FF"
            style={styles.icon}
            onPress={() => toggleShowPassword("confirm")}
          />
        </View>
      </View>

      <View style={styles.bottom}>
        <Button
          onPress={handleChangePassword}
          text="Modifier le mot de passe"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 80,
    marginHorizontal: 30,
    marginBottom: 60,
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
    color: "#120D26",
    marginTop: 24,
    marginLeft: 8,
  },
  bottom: {
    position: "absolute",
    bottom: 30,
    gap: 20,
    marginBottom: 30,
    width: "100%",
    alignItems: "center",
  },
  error: {
    marginTop: 10,
    color: "#EB5757",
    width: "90%",
    alignSelf: "center",
  },
  input: {
    flex: 1,
    height: 56,
    color: "#7887FF",
    fontSize: 14,
    marginLeft: 10,
  },
});
