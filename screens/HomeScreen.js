import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import globalStyles from "../globalStyles";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export default function HomeScreen({ navigation }) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.loadingContainer}>
        <Text>Hoooome</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  explorerContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
  },
  localisation: {
    marginTop: 50,
    color: "white",
  },
  localisationBold: {
    marginTop: 4,
    marginBottom: 24,
    color: "white",
    fontWeight: "bold",
  },
  organizers: {
    marginLeft: 10,
    gap: 8,
    // flex: 0.33,
  },
  header: {
    flex: 0.25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4A43EC",
    width: "100%",
  },
  filtersButton: {
    width: 70,
    alignItems: "center",
    backgroundColor: "#EBEDFF",
    borderRadius: 100,
    justifyContent: "center",
    padding: 6,
  },
  textButton: {
    color: "#5669FF",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
  },
  body: {
    flex: 0.8,
    width: "100%",
  },
  listActivities: {
    // height: "100%",
  },
  activitiesSectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAllActivities: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: 30,
    marginRight: 16,
  },
  seeAllTitle: {
    color: "#b8b6be",
    fontWeight: "bold",
  },
  errorActivitiesFetch: {
    marginTop: 24,
    marginHorizontal: 20,
    width: "90%",
    lineHeight: 25,
  },
  scrollView: {
    paddingHorizontal: 10,
    // marginTop: 20,
  },
  searchContainer: {
    // marginTop: 50,
    flex: 0.2,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4A43EC",
    width: "100%",
    paddingBottom: 20,
    borderBottomRightRadius: 33,
    borderBottomLeftRadius: 33,
  },
  search: {
    flexDirection: "row",
    gap: 8,
    height: 45,
    width: "90%",
  },
  searchBar: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 12,
    backgroundColor: "white",
  },
  input: {
    width: "90%",
    color: "#747688",
    fontSize: 16,
    marginLeft: 10,
  },
  dropdownContainer: {
    width: "100%",
  },
  inputContainer: {
    width: "90%",
    fontSize: 16,
    marginLeft: 10,
    backgroundColor: "white",
    marginLeft: 5,
  },
  suggestionListContainer: {
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  rightButtonsContainerStyle: {
    backgroundColor: "white",
  },
});
