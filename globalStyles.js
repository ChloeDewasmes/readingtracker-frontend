import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  // TITLES
  title1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#120D26",
  },
  title2: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#120D26",
    marginTop: 24,
    marginLeft: 30,
  },
  title3: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#29253C",
    marginTop: 24,
    marginLeft: 30,
    marginBottom: 4,
    textAlign: "left",
  },

  // FORMS
  labelInput: {
    marginLeft: 20,
    marginTop: 15,
  },
  inputContainer: {
    alignItems: "center",
  },
  border: {
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: "#BBC3FF",
    borderWidth: 1,
    borderRadius: 12,
    margin: 6,
    width: "90%",
  },
  input: {
    width: "90%",
    height: 56,
    color: "#7887FF",
    fontSize: 14,
    marginLeft: 10,
  },
  inputMultiline: {
    width: "90%",
    height: 56,
    color: "#747688",
    fontSize: 14,
    marginLeft: 4,
    marginTop: 8,
    marginBottom: 8,
  },
});

export default globalStyles;
