import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function ReadBooks({ bookId }) {
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get book info with its id
    fetch(`${BACKEND_ADDRESS}/books/${bookId}`)
      .then((response) => response.json())
      .then((data) => {
        // get needed data (title and author of the book)
        const { title, author } = data;
        setBookData({ title, author });
        setLoading(false);
      })
      .catch((err) => {
        console.log("Erreur lors de la récupération du livre lu:", err);
        setLoading(false);
      });
  }, [bookId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const handleMarkAsUnread = () => {
    AsyncStorage.getItem("userToken")
      .then((token) => {
        fetch(`${BACKEND_ADDRESS}/users/undoRead/${token}/${bookId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(async (response) => {
            const data = await response.json();
            if (response.ok) {
              console.log(
                "The book has been moved back to followed books",
                data
              );
            } else {
              console.log("Error:", data.message || "Unknown error");
            }
          })
          .catch((err) => {
            console.log("Request error:", err);
          });
      })
      .catch((err) => {
        console.log("Error retrieving token:", err);
      });
  };

  return (
    <View style={styles.book}>
      <Text style={styles.bookTitle} numberOfLines={1}>
        {bookData.title} - {bookData.author}
      </Text>
      <TouchableOpacity style={styles.readIcon} onPress={handleMarkAsUnread}>
        <FontAwesomeIcon
          icon={faBookmark}
          size={18}
          style={{ color: "#56ADDB" }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  book: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 30,
    marginTop: 20,
  },
  bookTitle: {
    fontSize: 16,
    width: 300,
  },
  readIcon: {
    position: "absolute",
    right: 30,
  },
});
