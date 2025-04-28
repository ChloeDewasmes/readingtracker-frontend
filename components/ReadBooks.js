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
    console.log("mark as unread");
  };

  return (
    <View style={styles.book}>
      <TouchableOpacity
        onPress={() => {
          setUpdateProgression(true);
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.bookTitle}>
          {bookData.title} - {bookData.author}
        </Text>
      </TouchableOpacity>
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
    marginTop: 25,
  },
  bookTitle: {
    fontSize: 16,
  },
  readIcon: {
    position: "absolute",
    top: 5,
    right: 30,
  },
});
