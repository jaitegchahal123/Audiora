import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, ScrollView, Text, Image, View } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { AuthStackParamList } from "./AuthStackScreen";
import { getAuth, signInWithEmailAndPassword, signInWithEmailLink } from "firebase/auth";
import { TouchableWithoutFeedback } from "react-native";


import { initializeApp } from 'firebase/app';

interface Props {
  navigation: StackNavigationProp<AuthStackParamList, "SignInScreen">;
}

export default function SignInScreen({ navigation }: Props) {
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const dismiss = () => setVisible(false);

  

  const signIn = () => {
  setLoading(true);
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      setLoading(false);
      console.log(userCredential);
    })
    .catch((error) => {
      setMessage("Incorrect");
      setVisible(true);
      setLoading(false);

    });
  };
    


    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 32,
        backgroundColor: "#ffffff",
      },
    });

   const logoImage = require('/Users/jaitegchahal/final3B/assets/new.png');

  return (
    <>
    <Appbar.Header style={{ backgroundColor: "white" }}>
  <Appbar.Content title="" titleStyle={{ color: "black" }} />
    </Appbar.Header>
      <SafeAreaView 
      style={{ ...styles.container, padding: 30 }}
      >
    <Image source={logoImage} style={{ width: 200, height: 200, alignSelf: "center", marginTop: 0.1 }} />
    <Text style={{color: "#71797E" ,alignSelf: 'center', marginTop: 10, fontSize: 34 }}>Audiora</Text>
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
  <TouchableWithoutFeedback
    onPress={() => console.log("Email button pressed")}
    style={{
      backgroundColor: "#F0F0F0",
      borderRadius: 30,
      padding: 10,
      marginTop: 35,
      width: 300,
    }}
  >
    <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={(email) => setEmail(email)}
        mode="outlined"
        style={{ width: '80%' }}
      />
    </View>
  </TouchableWithoutFeedback>

  <TouchableWithoutFeedback
    onPress={() => console.log("Password button pressed")}
    style={{
      backgroundColor: "#F0F0F0",
      borderRadius: 25,
      padding: 10,
      marginTop: 16,
      width: 300,
    }}
  >
    <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
      <TextInput
        label="Password"
        value={password}
        onChangeText={(password) => setPassword(password)}
        mode="outlined"
        secureTextEntry
        style={{ width: '80%' }}
      />
    </View>
  </TouchableWithoutFeedback>
</View>

        <View style={{justifyContent: 'center', alignItems: 'center' }}>
          <Button
            mode="contained"
            onPress={signIn}
            style={{ marginTop: 25, borderRadius: 100, width: 150 }}
            loading={loading}
          >
            Sign in
          </Button>

          <Button
            mode="contained"
            onPress={() => {
              navigation.navigate("SignUpScreen");
            }}
            style={{ marginTop: 16, borderRadius: 20, width: 150}}
          >
            Sign Up
          </Button>
        </View>
        <Button
          onPress={()=>{setMessage("Check email for reset instruction.")
          setVisible(true)
        }}
          style={{ marginTop: 16 }}
        >Reset Password</Button>
        <Snackbar
          duration={2000}
          visible={visible}
          onDismiss = {dismiss}
          action={{
          label: 'Undo',
          onPress: () => {
            dismiss
          },
        }}>
        
          {message}
        </Snackbar>
      </SafeAreaView>
    </>

  ); }