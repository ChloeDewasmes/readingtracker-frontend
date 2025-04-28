import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function FollowedBooks({ bookId, pagesRead, onPress }) {
  const [bookData, setBookData] = useState({ title: "", totalPages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get book info with its id
    fetch(`${BACKEND_ADDRESS}/books/followedBook/${bookId}`)
      .then((response) => response.json())
      .then((data) => {
        // get needed data (title and total pages in the book)
        const { title, totalPages } = data;
        setBookData({ title, totalPages });
        setLoading(false);
      })
      .catch((err) => {
        console.log("Erreur lors de la récupération du livre:", err);
        setLoading(false);
      });
  }, [bookId]);

  const progress =
    !loading && bookData.totalPages > 0
      ? (pagesRead / bookData.totalPages) * 100
      : 0;

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.book}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.bookTitle}>{bookData.title}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.progressionBorder}>
              <View
                style={[styles.progressionFill, { width: `${progress}%` }]}
              />
            </View>
            <Text style={styles.progressionText}>{progress.toFixed(2)} %</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.readIcon}>
        <FontAwesomeIcon
          icon={faBookmark}
          size={18}
          style={{ color: "#56ADDB" }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  book: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 30,
    marginTop: 25,
  },
  bookTitle: {
    fontSize: 16,
  },
  progressionBorder: {
    width: 200,
    height: 15,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    overflow: "hidden", // to contain fill
  },
  progressionFill: {
    height: "100%",
    backgroundColor: "#7887FF",
    borderRadius: 5,
  },
  progressionText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
  readIcon: {
    position: "absolute",
    top: 5,
    right: 30,
  },
});
