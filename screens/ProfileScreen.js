import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import globalStyles from "../globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../components/Button";
import ButtonPlainText from "../components/ButtonPlainText";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function ProfileScreen({ navigation }) {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidEmail, setInvalidEmail] = useState("");
  const [alreadyUsedEmail, setAlreadyUsedEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [emailUpdated, setEmailUpdated] = useState(Boolean);

  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  useEffect(() => {
    AsyncStorage.getItem("userToken").then((storedToken) => {
      if (storedToken) {
        setToken(storedToken);
        fetch(`${BACKEND_ADDRESS}/users/email/${storedToken}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.result) {
              setUserEmail(data.email);
            }
          })
          .catch((err) => {
            console.log("Erreur:", err);
          });
      }
    });
  }, []);

  const handleUpdateEmail = () => {
    setEmailUpdated(false);
    setAlreadyUsedEmail(false);
    setInvalidEmail(false);
    if (EMAIL_REGEX.test(email)) {
      fetch(`${BACKEND_ADDRESS}/users/email/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail: email }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.result) {
            console.log("Email updated:", data.email);
            setEmailUpdated(true);
          } else {
            console.log("Error:", data.error);
            setAlreadyUsedEmail(true);
          }
        });
    } else {
      setInvalidEmail(true);
    }
  };

  const handleLogout = () => {
    AsyncStorage.removeItem("userToken")
      .then(() => {
        console.log("Token supprimé !");
        navigation.navigate("Signin");
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion :", error);
      });
  };

  const handleDeleteAccount = async () => {
    const token = await AsyncStorage.getItem("userToken");

    if (!token) {
      console.log("Token not found, no user connected");
      return;
    }
    fetch(`${BACKEND_ADDRESS}/users/deleteAccount/:token`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((response) => response.json())
      .then((data) => {
        data.result;
        handleLogout(); //delete token from asyncStorage and go back to the authentication
      });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <View style={styles.container}>
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
            <Text style={globalStyles.title1} numberOfLines={1}>
              Mon Profil
            </Text>
          </View>

          <View style={{ flex: 1 }} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.title}>Modification du profil</Text>
          <Text style={styles.subtitle}>Email</Text>
          <View style={globalStyles.border}>
            <Ionicons name="mail-outline" size={24} color="#BBC3FF" />
            <TextInput
              placeholder={userEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              onChangeText={(value) => setEmail(value)}
              value={email}
              style={styles.input}
            />
          </View>
          {emailUpdated && (
            <View>
              <Text style={styles.validated}>L'email a bien été modifié.</Text>
            </View>
          )}
          {alreadyUsedEmail && (
            <View>
              <Text style={styles.error}>
                L'email indiqué est utilisé par un autre utilisateur.
              </Text>
            </View>
          )}
          {invalidEmail && (
            <View>
              <Text style={styles.error}>L'email indiqué est invalide.</Text>
            </View>
          )}
          <Button onPress={handleUpdateEmail} text="Modifier l'adresse mail" />

          <Text style={styles.subtitle}>Mot de passe</Text>
          <View style={globalStyles.border}>
            <Ionicons name="lock-closed-outline" size={24} color="#BBC3FF" />
            <TextInput
              placeholder="********"
              textContentType="password"
              secureTextEntry={!showPassword}
              style={styles.input}
            />
          </View>
        </View>

        <View style={{ marginTop: 30, gap: 15 }}>
          <View style={styles.buttons}>
            <MaterialCommunityIcons name="logout" size={24} color="#BBC3FF" />
            <ButtonPlainText onPress={handleLogout} text="Se déconnecter" />
          </View>
          <View style={styles.buttons}>
            <MaterialCommunityIcons
              name="delete-forever"
              size={24}
              color="#BBC3FF"
            />
            <ButtonPlainText
              onPress={handleDeleteAccount}
              text="Supprimer le compte"
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 80,
    marginHorizontal: 30,
    marginBottom: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#120D26",
    marginTop: 24,
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 24,
    marginLeft: 8,
  },
  bottom: {
    width: "100%",
    alignItems: "center",
  },
  buttons: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  error: {
    marginTop: 10,
    color: "#EB5757",
    width: "90%",
    alignSelf: "center",
  },
  validated: {
    marginTop: 10,
    color: "#56ADDB",
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
