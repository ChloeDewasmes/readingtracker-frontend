import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
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
  const [totalPage, setTotalPage] = useState("");
  const [pagesRead, setPagesRead] = useState("");
  const [inputError, setInputError] = useState("");

  const handleGenreChange = (selectedGenre) => {
    setGenre(selectedGenre);
  };

  const handleAddBook = async () => {
    const token = await AsyncStorage.getItem("userToken");

    if (!token) {
      console.log("Token not found, no user connected");
      return;
    }
    if (title && author && genre && totalPage && pagesRead) {
      fetch(`${BACKEND_ADDRESS}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          genre,
          totalPage,
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
            setTotalPage("");
            setPagesRead("");
          }
          console.log(data.error);
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
            {/* flex: 2 prends les 2/4 (la moitié) de l'écran */}
            <Text style={globalStyles.title1} numberOfLines={1}>
              Ajout d'un livre
            </Text>
          </View>

          <View style={{ flex: 1 }} />
        </View>

        <View style={styles.inputContainer}>
          {inputError && (
            <View>
              <Text style={styles.error}>
                Tous les champs doivent être remplis.
              </Text>
            </View>
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
            onChangeText={(value) => setTotalPage(value)}
            value={totalPage}
            style={styles.input}
          />
        </View>

        <Text style={globalStyles.title2}>Progression</Text>
        <View style={styles.border}>
          <TextInput
            placeholder="Nombre de pages lues"
            keyboardType="numeric"
            onChangeText={(value) => setPagesRead(value)}
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
    position: "absolute",
    bottom: 30,
    gap: 20,
    marginBottom: 30,
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
  text: {
    textAlign: "center",
    width: "80%",
    lineHeight: 24,
    alignSelf: "center",
  },
});
