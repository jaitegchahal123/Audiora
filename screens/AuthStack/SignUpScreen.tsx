import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { Text, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { AuthStackParamList } from "./AuthStackScreen";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

interface Props {
  navigation: StackNavigationProp<AuthStackParamList, "SignUpScreen">;
}

export default function SignUpScreen({ navigation }: Props) {
  /* Screen Requirements:
      - AppBar
      - Email & Password Text Input
      - Submit Button
      - Sign In Button (goes to Sign In Screen)
      - Snackbar for Error Messages
  
    All UI components on this screen can be found in:
      https://callstack.github.io/react-native-paper/
    All authentication logic can be found at:
      https://firebase.google.com/docs/auth/web/start
  */


 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [visible, setVisible] = useState(false);
 const [message, setMessage] = useState("");
 const [loading, setLoading] = useState(false);    
 
 const dismiss = () => setVisible(false);

  const signUp = () => {
    setLoading(true);
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password) 
      .then(() => {
        setLoading(false);
        console.log('User account created & signed in!');

      })
      .catch((error) => {
        setMessage(error);
        console.log(error);

      });
  };



      const styles = StyleSheet.create({
        container: {
          flex: 1,
          padding: 32,
          backgroundColor: "#ffffff",
        },
      });

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Sign Up" />
      </Appbar.Header>
      <SafeAreaView style={{ ...styles.container, padding: 30 }}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
        />
        <Button
          mode="contained"
          style={{ marginTop: 20 }}
          onPress={() => {signUp()}}
          loading={loading}
        >
          Sign Up
        </Button>
        <Button
          mode="contained"
          style={{ marginTop: 20 }}
          onPress={() => navigation.navigate("SignInScreen")}
        >
          Sign In Instead
        </Button>
        <Snackbar
          duration = {2000}
          visible={visible}
          onDismiss={dismiss}
          >
          {message}
        </Snackbar>
         
      </SafeAreaView>
          


    </>
  );
}