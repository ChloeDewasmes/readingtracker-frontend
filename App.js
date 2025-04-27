import { StyleSheet } from "react-native";
import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SigninScreen from "./screens/SigninScreen";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AddBookScreen from "./screens/AddBookScreen";
import ChangePasswordScreen from "./screens/ChangePasswordScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

export default function App() {
  //check if user is already connected by checking the token
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        // if token exists, redirect to Home screen directly
        navigation.replace("Home");
      } else {
        // no token --> Go to login screen
        navigation.replace("Login");
      }
    };

    checkToken();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Signin"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="AddBook" component={AddBookScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
