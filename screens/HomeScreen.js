import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser, faBookMedical } from "@fortawesome/free-solid-svg-icons";
import { LinearGradient } from "expo-linear-gradient";
import globalStyles from "../globalStyles";
import FollowedBooks from "../components/FollowedBooks";
import ReadBooks from "../components/ReadBooks";
import Badges from "../components/Badges";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function HomeScreen({ navigation }) {
  const [userData, setUserData] = useState({
    points: 0,
    badges: [],
    followedBooks: [],
    readBooks: [],
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  const handleUserDataRefresh = () => {
    AsyncStorage.getItem("userToken").then((token) => {
      if (token) {
        fetch(`${BACKEND_ADDRESS}/users/${token}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.result) {
              setUserData(data.data);
            }
          })
          .catch((err) => {
            console.log("Erreur:", err);
          });
      }
    });
  };

  useEffect(() => {
    handleUserDataRefresh();
  }, []);

  /* FOLLOWED BOOKS */
  const followedBooks = userData.followedBooks.map((book, i) => {
    return (
      <FollowedBooks
        key={i}
        bookId={book.bookId}
        pagesRead={book.pagesRead}
        onDataChange={handleUserDataRefresh}
      />
    );
  });

  /* READ BOOKS */
  const readBooks = userData.readBooks.map((book, i) => {
    return (
      <ReadBooks
        key={i}
        bookId={book.bookId}
        onDataChange={handleUserDataRefresh}
      />
    );
  });

  /* POINTS */
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

  /* BADGES */
  const getBadgeProps = (badge) => {
    //don't show badge "reader_5" if badge "reader_20" was attributed
    if (badge === "reader_5" && userData.badges.includes("reader_20")) {
      return null;
    }

    //don't show badge "reader_1" if badge "reader_5" or "reader_20" was attributed
    if (
      badge === "reader_1" &&
      (userData.badges.includes("reader_5") ||
        userData.badges.includes("reader_20"))
    ) {
      return null;
    }

    // don't show badge "gender_3" if badge "gender_5" was attributed
    if (badge === "genre_3" && userData.badges.includes("genre_5")) {
      return null;
    }

    switch (badge) {
      case "reader_1":
        return {
          gradient: 1,
          iconName: "bookshelf",
          number: 1,
          label: "Première Lecture",
          description:
            "Félicitations pour ta toute première lecture terminée !",
        };
      case "reader_5":
        return {
          gradient: 1,
          iconName: "bookshelf",
          number: 5,
          label: "Lecteur·trice assidu·e",
          description: "Tu as lu 5 livres ! Continue comme ça !",
        };
      case "reader_20":
        return {
          gradient: 1,
          iconName: "bookshelf",
          number: 20,
          label: "Bibliophile",
          description: "20 livres lus, tu es un·e vrai·e passionné·e !",
        };
      case "genre_3":
        return {
          gradient: 2,
          iconName: "bookshelf",
          number: 3,
          label: "Explorer les genres",
          description: "Tu as exploré 3 genres littéraires différents.",
        };
      case "genre_5":
        return {
          gradient: 2,
          iconName: "bookshelf",
          number: 5,
          label: "Aventurier·ère littéraire",
          description: "5 livres de genres différents terminés !",
        };
      case "5_books_2_weeks":
        return {
          gradient: 3,
          iconName: "lightning-bolt",
          label: "Lecture rapide",
          description:
            "5 livres lus en seulement deux semaines ! Quelle vitesse impressionnante.",
        };
      case "300_pages_book":
        return {
          gradient: 3,
          iconName: "book-open",
          label: "Marathon de lecture",
          description:
            "Un livre de plus de 300 pages terminé ! Tu es prêt·e pour les grandes épopées.",
        };
      case "10_books_month":
        return {
          gradient: 1,
          iconName: "calendar",
          number: 10,
          label: "10 livres dans un mois",
          description:
            "10 livres en un mois ?! Ta soif de lecture est sans limites !",
        };
      case "30_books_year":
        return {
          gradient: 2,
          iconName: "calendar",
          number: 30,
          label: "30 livres dans l’année",
          description:
            "Objectif annuel atteint : 30 livres lus cette année. Bravo pour ta persévérance !",
        };
      default:
        return {}; // Don't show any badge if no valid props
    }
  };

  const badges = userData.badges.map((badge, index) => {
    const badgeProps = getBadgeProps(badge);
    if (!badgeProps) return null;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setSelectedBadge(badgeProps); // store props of the badge
          setModalVisible(true); // open modal
        }}
      >
        <Badges
          gradient={badgeProps.gradient}
          iconName={badgeProps.iconName}
          number={badgeProps.number}
          label={badgeProps.label}
        />
      </TouchableOpacity>
    );
  });

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
          {badges}
        </ScrollView>
      )}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.overlay}>
          {selectedBadge && (
            <View style={styles.modalContainer}>
              {/* Close modal */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <MaterialCommunityIcons name="close" size={30} color="#333" />
              </TouchableOpacity>

              {/* Zoom on badge */}
              <Badges
                gradient={selectedBadge.gradient}
                iconName={selectedBadge.iconName}
                number={null} // don't show number on big badge
                label={null} // On n'affiche pas le label ici pour plus de focus
                size={150} // Plus grand que dans la liste
              />

              {/* Badge description */}
              <Text style={styles.label}>{selectedBadge.label}</Text>
              <Text style={styles.description}>
                {selectedBadge.description}
              </Text>
            </View>
          )}
        </View>
      </Modal>
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
  //Modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // fond noir transparent
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    left: 15,
    zIndex: 10,
  },
  label: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
    color: "#666",
  },
});
