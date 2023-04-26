import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, ScrollView, Text } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { AuthStackParamList } from "./AuthStackScreen";
import firebase from "firebase";

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
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text>{"TODO"}</Text>
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
