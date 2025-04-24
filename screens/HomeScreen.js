import { StyleSheet, Text, Image, View, ScrollView } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faUser, faBookMedical } from "@fortawesome/free-solid-svg-icons";
import globalStyles from "../globalStyles";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function HomeScreen({ navigation }) {
  //const user = useSelector((state) => state.user.value);

  /*const badgesList = user.badges.map((badge, i) => (
    <Card key={i} badge={badge} />
  ));*/
  const badgesList = [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesomeIcon
          icon={faUser}
          size={18}
          style={{ color: "#56ADDB" }}
          onPress={() => navigation.navigate("Profile")}
        />
        <Text style={globalStyles.title1}>Ma Bibliothèque</Text>
        <FontAwesomeIcon
          icon={faBookMedical}
          size={22}
          style={{ color: "#56ADDB" }}
        />
      </View>

      <View style={styles.level}>
        <Text style={styles.levelText}>
          20pts - Niveau Débutant (le nul...)
        </Text>
      </View>

      <Text style={globalStyles.title2}>Livres Suivis</Text>
      {badgesList.length === 0 ? ( // if badgesList is empty
        <View style={styles.noBagdesContainer}>
          <Text style={styles.text}>Vous n'avez pas de livre en cours.</Text>
          <Text style={styles.text}>
            Ajouter des livres et compléter la lecture pour obtenir des badges !
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
        >
          {badgesList}
        </ScrollView>
      )}

      <Text style={globalStyles.title2}>Livres Lus</Text>
      {badgesList.length === 0 ? ( // if badgesList is empty
        <View style={styles.noBagdesContainer}>
          <Text style={styles.text}>
            Vous n'avez pas encore terminé de livre.
          </Text>
          <Text style={styles.text}>
            Complétez la lecture pour obtenir des badges !
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
        >
          {badgesList}
        </ScrollView>
      )}

      <Text style={globalStyles.title2}>Badges</Text>
      {badgesList.length === 0 ? ( // if badgesList is empty
        <View style={styles.noBagdesContainer}>
          <Image
            style={styles.img}
            source={require("../assets/images/book-logo.jpg")}
          />
          <Text style={styles.text}>Vous n'avez pas encore de badges.</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
        >
          {badgesList}
        </ScrollView>
      )}
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
