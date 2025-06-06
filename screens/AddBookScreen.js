import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import globalStyles from "../globalStyles";
import GenreDropdown from "../components/GenreDropdown";
import Button from "../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function ProfileScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [pagesRead, setPagesRead] = useState(0);
  const [inputError, setInputError] = useState("");

  const handleGenreChange = (selectedGenre) => {
    setGenre(selectedGenre);
  };

  const handleAddBook = async () => {
    if (pagesRead > totalPages) return; //the number of pages read must be lower or equal to the total number of pages in the book

    const token = await AsyncStorage.getItem("userToken");

    if (!token) {
      console.log("Token not found, no user connected");
      return;
    }
    if (title && author && genre && totalPages && pagesRead) {
      fetch(`${BACKEND_ADDRESS}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          genre,
          totalPages,
          pagesRead,
          token,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            navigation.navigate("Home");
            setTitle("");
            setAuthor("");
            setGenre("");
            setTotalPages("");
            setPagesRead("");
          }
        });
    } else {
      setInputError(true);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            <Text style={globalStyles.title1} numberOfLines={1}>
              Ajout d'un livre
            </Text>
          </View>

          <View style={{ flex: 1 }} />
        </View>

        <View style={styles.inputContainer}>
          {inputError && (
            <Text style={styles.error}>
              Tous les champs doivent être remplis.
            </Text>
          )}
          {pagesRead > totalPages && (
            <Text style={styles.error}>
              Oups, tu as lu plus de pages que le livre n'en contient !
            </Text>
          )}
          <Text style={globalStyles.title2}>Titre</Text>
          <View style={styles.border}>
            <TextInput
              placeholder="Titre du livre"
              onChangeText={(value) => setTitle(value)}
              value={title}
              style={styles.input}
            />
          </View>
        </View>

        <Text style={globalStyles.title2}>Auteur.ice</Text>
        <View style={styles.border}>
          <TextInput
            placeholder="Auteur.ice"
            onChangeText={(value) => setAuthor(value)}
            value={author}
            style={styles.input}
          />
        </View>

        <Text style={globalStyles.title2}>Genre</Text>
        <GenreDropdown onSelectGenre={handleGenreChange} />

        <Text style={globalStyles.title2}>Nombre de page</Text>
        <View style={styles.border}>
          <TextInput
            placeholder="Nombre de page"
            keyboardType="numeric"
            onChangeText={(value) => setTotalPages(parseInt(value, 10) || "")} //stored as number to check condition pagesRead < TotalPages
            value={totalPages}
            style={styles.input}
          />
        </View>

        <Text style={globalStyles.title2}>Progression</Text>
        <View style={styles.border}>
          <TextInput
            placeholder="Nombre de pages lues"
            keyboardType="numeric"
            onChangeText={(value) => setPagesRead(parseInt(value, 10) || "")} //stored as number to check condition pagesRead < TotalPages
            value={pagesRead}
            style={styles.input}
          />
        </View>

        <View style={styles.bottom}>
          <Button onPress={handleAddBook} text="Ajouter" />
        </View>
      </View>
    </TouchableWithoutFeedback>
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
    marginTop: 80,
    marginHorizontal: 30,
    marginBottom: 60,
  },
  bottom: {
    marginTop: 30,
    width: "100%",
    alignItems: "center",
  },
  error: {
    marginTop: 10,
    width: "85%",
    color: "#EB5757",
    alignSelf: "center",
  },
  border: {
    justifyContent: "center",
    paddingLeft: 10,
    borderColor: "#BBC3FF",
    borderWidth: 1.5,
    borderRadius: 5,
    height: 30,
    marginTop: 10,
    marginHorizontal: 30,
  },
  input: {
    color: "#7887FF",
  },
});
