import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, ScrollView, Text, Image, View } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { AuthStackParamList } from "./AuthStackScreen";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../App";

interface Props {
  navigation: StackNavigationProp<AuthStackParamList, "SignUpScreen">;
}

export default function SignUpScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const onDismissSnackBar = () => setVisible(false);
  const showError = (error: string) => {
    setMessage(error);
    setVisible(true);
  };
  const auth = getAuth();
  const handleSignUp = () => {
    try {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          console.log(userCredential);
        });
    } catch (error) {
      // showError(error)
    }
  };
  /* Screen Requirements:
      - AppBar
      - Email & Password Text Input
      - Submit Button
      - Sign Up Button (goes to Sign Up screen)
      - Reset Password Button
      - Snackbar for Error Messages
  
    All UI components on this screen can be found in:
      https://callstack.github.io/react-native-paper/
    All authentication logic can be found at:
      https://firebase.google.com/docs/auth/web/starts
  */
  return (
    <>
      <Appbar.Header style={{ backgroundColor: "white" }}>
        <Appbar.Content title="Create an Account" titleStyle={{alignSelf: 'center', marginTop: 30, fontSize: 21, fontFamily: 'Avenir-Book'}} />
      </Appbar.Header>
      <SafeAreaView style={{ ...styles.container, padding: 30 }}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
  <TextInput
    placeholder="Email"
    label="Email"
    value={email}
    onChangeText={(email) => setEmail(email)}
    style={{
      width: 400,
      marginTop: 18,
      backgroundColor: "#F0F0F0",
      borderWidth: 1,
      borderColor: "black",
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 2,
      paddingBottom: 2,
      marginBottom: 20,
      height: 47
    }}
    autoComplete={false}
  />

  <TextInput
    label="Password"
    value={password}
    onChangeText={(password) => setPassword(password)}
    style={{
      width: 400,
      marginTop: 0.4,
      backgroundColor: "#F0F0F0",
      borderWidth: 1,
      borderColor: "black",
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 2,
      paddingBottom: 2,
      marginBottom: 20,
      height: 47
    }}
    autoComplete={false}
    secureTextEntry
  />
</View>
    <View style={{justifyContent: 'center', alignItems: 'center' }}>
      <Button
        mode="contained"
        onPress={handleSignUp}
        style={{ marginTop: 10, backgroundColor: "#45A3F9", borderRadius: 20, width: 350 }}
        compact
        loading={loading}
      >
    <Text style={{ color: "white", fontSize: 16 }}>CREATE AN ACCOUNT</Text>
  </Button>
  <Button
    onPress={() => {
      navigation.navigate("SignInScreen");
    }}
    style={{ marginTop: 20, backgroundColor: "#F2F2F2", borderRadius: 20, width: 350 }}
    compact
    loading={loading}
  >
    <Text style={{ color: "#707070", fontSize: 16 }}>OR, SIGN IN INSTEAD</Text>
  </Button>
</View>
        <Snackbar
          duration={3000}
          visible={visible}
          onDismiss={onDismissSnackBar}
        >
          {message}
        </Snackbar>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: "#ffffff",
  },
});