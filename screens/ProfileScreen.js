import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import globalStyles from "../globalStyles";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function ProfileScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  return (
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

      <Text style={globalStyles.title2}>Email</Text>
      <TextInput></TextInput>

      <Text style={globalStyles.title2}>Mot de passe</Text>
      <TextInput></TextInput>

      <Text style={globalStyles.text}>Modifier ces informations</Text>
      <Text style={globalStyles.text}>Supprimer le compte</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 80,
    marginHorizontal: 30,
    marginBottom: 60,
  },
  text: {
    textAlign: "center",
    width: "80%",
    lineHeight: 24,
    alignSelf: "center",
  },
});
