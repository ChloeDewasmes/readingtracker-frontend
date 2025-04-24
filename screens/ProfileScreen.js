import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TextInput,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import globalStyles from "../globalStyles";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesomeIcon
          icon={faArrowLeft}
          size={18}
          style={{ color: "#56ADDB" }}
        />
        <Text style={globalStyles.title1}>Mon Profil</Text>
      </View>

      <Text style={globalStyles.title2}>Email</Text>
      <Input></Input>

      <Text style={globalStyles.title2}>Mot de passe</Text>
      <Input></Input>

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
  level: {
    alignSelf: "center",
    marginBottom: 20,
    width: "85%",
    height: "8%",
    borderRadius: 10,
    backgroundColor: "#AAB4FF",
    justifyContent: "center",
    alignItems: "center",
  },
  levelText: {
    fontSize: 16,
    fontWeight: "500",
  },
  noBadgesContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: 80,
    height: 80,
    borderRadius: 150,
    marginBottom: 20,
    alignSelf: "center",
    // backgroundColor: '#EEF0FF',
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    width: "80%",
    lineHeight: 24,
    alignSelf: "center",
  },
});
