import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Modal,
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
  const [invalidEmail, setInvalidEmail] = useState("");
  const [alreadyUsedEmail, setAlreadyUsedEmail] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [emailUpdated, setEmailUpdated] = useState(Boolean);
  const [deleteValidation, setDeleteValidation] = useState(Boolean);

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
    setDeleteValidation(false);
    const token = await AsyncStorage.getItem("userToken");

    if (!token) {
      console.log("Token not found, no user connected");
      return;
    }
    fetch(`${BACKEND_ADDRESS}/users/deleteAccount/${token}`, {
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
              style={globalStyles.input}
            />
          </View>
          {emailUpdated && (
            <View>
              <Text style={styles.updated}>L'email a bien été modifié.</Text>
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
          <TouchableOpacity
            onPress={() => navigation.navigate("ChangePassword")}
            style={{ width: "100%" }}
          >
            <View style={globalStyles.border} pointerEvents="none">
              <Ionicons name="lock-closed-outline" size={24} color="#BBC3FF" />
              <TextInput
                value="********"
                editable={false}
                style={[globalStyles.input, { color: "#C7C7CD" }]}
              />
            </View>
          </TouchableOpacity>
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
              onPress={() => setDeleteValidation(true)}
              text="Supprimer le compte"
            />
          </View>
        </View>
        <Modal
          transparent={true}
          visible={deleteValidation}
          animationType="fade"
          onRequestClose={() => setDeleteValidation(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                Êtes-vous sûr de vouloir supprimer ce compte et toutes les
                données qui y sont associées ?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setDeleteValidation(false)}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleDeleteAccount}
                >
                  <Text style={styles.confirmButtonText}>Confirmer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  updated: {
    marginTop: 10,
    color: "#56ADDB",
    width: "90%",
    alignSelf: "center",
  },
  // MODAL
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#FF6B6B",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
