import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";

const genres = [
  "Aventure",
  "Autres",
  "Bande dessinée (BD)",
  "Bien-être / Santé",
  "Cuisine / Gastronomie",
  "Documentaire",
  "Drame",
  "Éducation / Pédagogie",
  "Essai",
  "Fantastique",
  "Féminisme / Études de genre",
  "Historique",
  "Horreur",
  "Maison / Jardin / Bricolage",
  "Manga",
  "Philosophie",
  "Poésie",
  "Politique / Économie",
  "Psychologie",
  "Romance",
  "Science-fiction",
  "Sociologie",
  "Spiritualité / Religion",
  "Théâtre",
  "Thriller",
  "Voyage / Guide touristique",
];

// On génère la structure attendue avec label = value
const data = genres.sort().map((genre) => ({
  label: genre,
  value: genre,
}));

const DropdownComponent = ({ onSelectGenre }) => {
  const [value, setValue] = useState(null);

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === value && (
          <AntDesign
            style={styles.icon}
            color="black"
            name="checkcircle"
            size={20}
          />
        )}
      </View>
    );
  };

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={data}
      value={value}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="Sélectionner le genre"
      searchPlaceholder="Search..."
      onChange={(item) => {
        setValue(item.value);
        onSelectGenre(item.value);
      }}
      renderItem={renderItem}
    />
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    marginHorizontal: 30,
    paddingLeft: 10,
    borderColor: "#BBC3FF",
    borderWidth: 1.5,
    borderRadius: 5,
    height: 30,
    marginTop: 10,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#C7C7CD",
  },
  selectedTextStyle: {
    fontSize: 14,
    color: "#7887FF",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
