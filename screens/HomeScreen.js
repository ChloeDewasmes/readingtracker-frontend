import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser, faBookMedical } from "@fortawesome/free-solid-svg-icons";
import { LinearGradient } from "expo-linear-gradient";
import globalStyles from "../globalStyles";
import FollowedBooks from "../components/FollowedBooks";
import ReadBooks from "../components/ReadBooks";
import Badge from "../components/Badge";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function HomeScreen({ navigation }) {
  const [userData, setUserData] = useState({
    points: 0,
    badges: [],
    followedBooks: [],
    readBooks: [],
  });

  useEffect(() => {
    AsyncStorage.getItem("userToken").then((token) => {
      if (token) {
        fetch(`${BACKEND_ADDRESS}/users/${token}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.result) {
              setUserData(data.data);
              // Ex: data.data.points, data.data.badges, etc.
            }
          })
          .catch((err) => {
            console.log("Erreur:", err);
          });
      }
    });
  }, [userData]);

  let level = "🐣 Débutant";
  let levelMessage = "Chaque page est une victoire !";

  if (userData.points >= 51 && userData.points <= 150) {
    level = "📖 Amateur";
    levelMessage = "Continue à tourner les pages !";
  } else if (userData.points >= 151 && userData.points <= 300) {
    level = "🚀 Confirmé";
    levelMessage = "Ton aventure littéraire est impressionnante !";
  } else if (userData.points >= 301) {
    level = "🏆 Expert";
    levelMessage = "Un maître des livres, bravo !";
  }

  const followedBooks = userData.followedBooks.map((book, i) => {
    return (
      <FollowedBooks key={i} bookId={book.bookId} pagesRead={book.pagesRead} />
    );
  });

  const readBooks = userData.readBooks.map((book, i) => {
    return <ReadBooks key={i} bookId={book.bookId} />;
  });

  const badgesList = [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <FontAwesomeIcon
            icon={faUser}
            size={18}
            style={{ color: "#56ADDB" }}
          />
        </TouchableOpacity>
        <Text style={globalStyles.title1}>Ma Bibliothèque</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AddBook")}>
          <FontAwesomeIcon
            icon={faBookMedical}
            size={22}
            style={{ color: "#56ADDB" }}
          />
        </TouchableOpacity>
      </View>

      <LinearGradient
        colors={["#8E2DE2", "#FF6EC7", "#FF9A00", "#FFE600"]}
        start={{ x: -0.2, y: 0 }}
        end={{ x: 1.2, y: 1 }}
        locations={[0, 0.4, 0.7, 1]}
        style={styles.gradientBackground}
      >
        <Text style={styles.levelText}>
          {level} - {userData.points} pts
        </Text>
        <Text style={{ fontSize: 14, fontWeight: "300", marginTop: 4 }}>
          {levelMessage}
        </Text>
      </LinearGradient>

      <Text style={globalStyles.title2}>Livres Suivis</Text>
      {userData.followedBooks.length === 0 ? ( // if the user isn't reading any book
        <View style={styles.followedBooksContainer}>
          <Text style={styles.text}>Vous n'avez pas de livre en cours.</Text>
          <Text style={styles.text}>
            Ajouter des livres et pour suivre votre progression !
          </Text>
        </View>
      ) : (
        <View style={styles.followedBooksContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollView}
          >
            {followedBooks}
          </ScrollView>
        </View>
      )}

      <Text style={globalStyles.title2}>Livres Lus</Text>
      {userData.readBooks.length === 0 ? ( // if the user haven't finished any book
        <View style={styles.noBagdesContainer}>
          <Text style={styles.text}>
            Vous n'avez pas encore terminé de livre.
          </Text>
          <Text style={styles.text}>
            Complétez la lecture pour obtenir des badges !
          </Text>
        </View>
      ) : (
        <View style={styles.followedBooksContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollView}
          >
            {readBooks}
          </ScrollView>
        </View>
      )}

      <Text style={globalStyles.title2}>Badges</Text>
      {userData.badges.length === 0 ? ( // if the user doesn't have any badge
        <View style={styles.readBooksContainer}>
          <Image
            style={styles.img}
            source={require("../assets/images/book-logo.jpg")}
          />
          <Text style={styles.text}>Vous n'avez pas encore de badges.</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.badgeScrollView}
        >
          <Badge
            gradient={1}
            iconName="bookshelf"
            number={1}
            label="Première Lecture"
          />
          <Badge
            gradient={1}
            iconName="bookshelf"
            number={5}
            label="Lecteur·trice assidu·e"
          />
          <Badge
            gradient={1}
            iconName="bookshelf"
            number={20}
            label="Bibliophile"
          />

          <Badge
            gradient={2}
            iconName="bookshelf"
            number={3}
            label="Explorer les genres"
          />
          <Badge
            gradient={2}
            iconName="bookshelf"
            number={5}
            label="Aventurier·ère littéraire"
          />

          <Badge
            gradient={3}
            iconName="lightning-bolt"
            label="Lecture rapide"
          />
          <Badge
            gradient={3}
            iconName="book-open"
            label="Marathon de lecture"
          />

          <Badge
            gradient={1}
            iconName="calendar"
            number={10}
            label="10 livres dans un mois"
          />
          <Badge
            gradient={2}
            iconName="calendar"
            number={30}
            label="30 livres dans l’année"
          />
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
    marginBottom: 45,
  },
  gradientBackground: {
    alignSelf: "center",
    marginBottom: 10,
    width: "85%",
    height: "8%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
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
    marginRight: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  badgeScrollView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  followedBooksContainer: {
    height: "15%",
    marginBottom: 25,
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
