import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
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
  const [passwords, setPasswords] = useState({
    old: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordUpdated, setPasswordUpdated] = useState(Boolean);

  //change each password input change
  const handleChangePassword = (field, value) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  //save new password - on click
  const handleSaveNewPassword = async () => {
    setPasswordUpdated(false);
    setPasswordError("");
    const {
      old: oldPassword,
      new: newPassword,
      confirm: confirmPassword,
    } = passwords;

    if (newPassword !== confirmPassword) {
      // Show error message if passwords are not matching
      setPasswordError("Les mots de passe ne correspondent pas.");
      return;
    }

    // If passwords are similar, send request to backend
    const token = await AsyncStorage.getItem("userToken");

    // Error messages to show user
    const errorMessages = {
      OLD_PASSWORD_INCORRECT: "Le mot de passe actuel est incorrect.",
      NEW_PASSWORDS_DO_NOT_MATCH: "Les mots de passe ne correspondent pas.",
    };

    if (token) {
      fetch(`${BACKEND_ADDRESS}/users/password/${token}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
          confirmPassword,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            console.log("Password successfully updated");
            setPasswordUpdated(true);
          } else {
            console.log(data.error);
            setPasswordError(
              errorMessages[data.error] || "Une erreur est survenue"
            );
          }
        })
        .catch((err) => {
          console.log("Error occurred:", err);
        });
    }
  };

  // Show passwords
  const toggleShowPassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const fields = [
    { key: "old", label: "Ancien mot de passe" },
    { key: "new", label: "Nouveau mot de passe" },
    { key: "confirm", label: "Confirmer le mot de passe" },
  ];

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

      {fields.map(({ key, label, icon }) => (
        <View key={key}>
          <Text style={styles.title}>{label}</Text>
          <View style={globalStyles.border}>
            {icon && <Ionicons name={icon} size={24} color="#BBC3FF" />}
            <TextInput
              placeholder={label}
              textContentType="password"
              secureTextEntry={!showPasswords[key]}
              onChangeText={(text) => handleChangePassword(key, text)}
              value={passwords[key]}
              style={globalStyles.input}
            />
            <MaterialCommunityIcons
              name={showPasswords[key] ? "eye-off" : "eye"}
              size={24}
              color="#BBC3FF"
              style={styles.icon}
              onPress={() => toggleShowPassword(key)}
            />
          </View>
        </View>
      ))}
      {passwordError && (
        <View>
          <Text style={styles.error}>{passwordError}</Text>
        </View>
      )}
      {passwordUpdated && (
        <View>
          <Text style={styles.updated}>
            Le mot de passe a bien été mis à jour !
          </Text>
        </View>
      )}

      <View style={styles.bottom}>
        <Button
          onPress={handleSaveNewPassword}
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
  updated: {
    marginTop: 10,
    color: "#56ADDB",
    width: "90%",
    alignSelf: "center",
  },
});
