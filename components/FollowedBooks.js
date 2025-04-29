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
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function FollowedBooks({ bookId, pagesRead, onDataChange }) {
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [updateProgression, setUpdateProgression] = useState(Boolean);
  const [updatedPagesRead, setUpdatedPagesRead] = useState(pagesRead);

  useEffect(() => {
    // Get book info with its id
    fetch(`${BACKEND_ADDRESS}/books/${bookId}`)
      .then((response) => response.json())
      .then((data) => {
        // get needed data (title, author and total pages of the book)
        const { title, author, totalPages } = data;
        setBookData({ title, author, totalPages });
        setLoading(false);
      })
      .catch((err) => {
        console.log("Erreur lors de la récupération du livre suivi:", err);
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

  const handleUpdateProgression = async (pagesReadValue) => {
    const token = await AsyncStorage.getItem("userToken");

    if (!token) {
      console.log("Token not found");
      return;
    }

    fetch(`${BACKEND_ADDRESS}/users/updatePagesRead/${token}/${bookId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        updatedPagesRead: pagesReadValue || updatedPagesRead,
        totalPages: bookData.totalPages,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log("Progression mise à jour !");
          //reload updated informations
          console.log("pages lues", updatedPagesRead);
          if (onDataChange) {
            onDataChange(); // Refresh Home
          }
          setUpdateProgression(false); // then close modal
        }
      })
      .catch((err) => {
        console.log("Erreur lors de la mise à jour:", err);
      });
  };

  const handleMarkAsRead = async () => {
    const pages = bookData.totalPages;
    setUpdatedPagesRead(pages);
    handleUpdateProgression(pages);
  };

  return (
    <View style={styles.book}>
      <TouchableOpacity
        onPress={() => {
          setUpdateProgression(true);
        }}
        activeOpacity={0.8}
      >
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.bookTitle} numberOfLines={1}>
            {bookData.title} - {bookData.author}
          </Text>
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
      <TouchableOpacity style={styles.readIcon} onPress={handleMarkAsRead}>
        <FontAwesomeIcon
          icon={faBookmark}
          size={18}
          style={{ color: "#56ADDB" }}
        />
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={updateProgression}
        animationType="fade"
        onRequestClose={() => setUpdateProgression(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Où en es-tu dans ta lecture ?</Text>
            {updatedPagesRead > bookData.totalPages && (
              <Text style={styles.error}>
                Oups, tu as lu plus de pages que le livre n'en contient !
              </Text>
            )}
            <View style={styles.border}>
              <TextInput
                placeholder="Nombre de pages lues"
                keyboardType="numeric"
                onChangeText={(value) =>
                  setUpdatedPagesRead(parseInt(value, 10) || "")
                } //stored as number to check condition pagesRead < TotalPages
                value={updatedPagesRead}
                style={styles.input}
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setUpdateProgression(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => handleUpdateProgression(updatedPagesRead)}
              >
                <Text style={styles.confirmButtonText}>Valider</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    width: 300,
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
  // MODAL
  border: {
    justifyContent: "center",
    paddingLeft: 10,
    borderColor: "#BBC3FF",
    borderWidth: 1.5,
    borderRadius: 5,
    height: 30,
    width: "100%",
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 30,
  },
  input: {
    color: "#7887FF",
  },
  error: {
    width: "85%",
    color: "#EB5757",
    textAlign: "center",
  },
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
    marginBottom: 10,
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
    backgroundColor: "#56ADDB",
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
