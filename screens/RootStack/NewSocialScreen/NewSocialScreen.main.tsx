import React, { useState, useEffect } from "react";
import { Platform, View, StyleSheet } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { getFileObjectAsync } from "../../../Utils";

// See https://github.com/mmazzarolo/react-native-modal-datetime-picker
// Most of the date picker code is directly sourced from the example
import DateTimePickerModal from "react-native-modal-datetime-picker";

// See https://docs.expo.io/versions/latest/sdk/imagepicker/
// Most of the image picker code is directly sourced from the example
import * as ImagePicker from "expo-image-picker";
import { styles } from "./NewSocialScreen.styles";

import { getFirestore, doc, collection, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getApp } from "firebase/app";
import { SocialModel } from "../../../models/social";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackScreen";
import {getAuth} from "firebase/auth";

interface Props {
  navigation: StackNavigationProp<RootStackParamList, "NewSocialScreen">;
}



export default function NewSocialScreen({ navigation }: Props) {
  // Event details.
  const [eventName, setEventName] = useState("");
  const [eventPrice, setEventPrice] = useState("");
  const [eventDate, setEventDate] = useState<Date>();
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventImage, setEventImage] = useState<string | undefined>(undefined);
  // Date picker.
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [visible, setVisible] = useState(false);
  // Snackbar.
  const [message, setMessage] = useState("");
  // Loading state for submit button
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const currentUserId = auth.currentUser!.uid;



  // Code for ImagePicker (from docs)
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();

  }, []);


  // Code for ImagePicker (from docs)
  const pickImage = async () => {
    console.log("picking image");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log("done");
    if (!result.canceled) {
      setEventImage(result.assets[0].uri);
    }
  };

  // Code for DatePicker (from docs)
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  // Code for DatePicker (from docs)
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // Code for DatePicker (from docs)
  const handleConfirm = (date: Date) => {
    date.setSeconds(0);
    setEventDate(date);
    hideDatePicker();
  };

  const handlePriceChange = (price) => {
    // Remove the "$" sign and convert the input value to a number
    const parsedPrice = parseFloat(price.replace('$', ''));
    setEventPrice(parsedPrice);
  };

  // Code for SnackBar (from docs)
  const onDismissSnackBar = () => setVisible(false);
  const showError = (error: string) => {
    setMessage(error);
    setVisible(true);
  };

  // This method is called AFTER all fields have been validated.
  const saveEvent = async () => {
    if (!eventName) {
      showError("Please enter an equipment name.");
      return;
    } else if (!eventDate) {
      showError("Please choose a rental date.");
      return;
    }else if (!eventPrice) {
      showError("Please show a price");
      return;
    } else if (!eventLocation) {
      showError("Please enter a location.");
      return;
    } else if (!eventDescription) {
      showError("Please enter a description.");
      return;
    } else if (!eventImage) {
      showError("Please choose an image.");
      return;
    } else {
      setLoading(true);
    }

    try {
      // Firestore wants a File Object, so we first convert the file path
      // saved in eventImage to a file object.
      console.log("getting file object");
      const object: Blob = (await getFileObjectAsync(eventImage)) as Blob;
      // Generate a brand new doc ID by calling .doc() on the socials node.
      const db = getFirestore();
      const socialsCollection = collection(db, "socials");
      const socialRef = doc(socialsCollection);
      console.log("putting file object");
      const storage = getStorage(getApp());
      const storageRef = ref(storage, socialRef.id + ".jpg");
      const result = await uploadBytes(storageRef, object);
      console.log("getting download url");
      const downloadURL = await getDownloadURL(result.ref);
      const socialDoc: SocialModel = {
        userCreated: currentUserId,
        eventName: eventName,
        eventPrice: eventPrice,
        eventDate: eventDate.getTime(),
        eventLocation: eventLocation,
        eventDescription: eventDescription,
        eventImage: downloadURL,
        interested: false
      };
      console.log("setting download url");
      await setDoc(socialRef, socialDoc);
      setLoading(false);
      navigation.goBack();
    } catch (error: any) {
      setLoading(false);
      showError(error.toString());
    }
  };

  const styles = StyleSheet.create({
    header: {
      backgroundColor: "#999999",
      elevation: 0,
    },
    title: {
      fontFamily: 'Avenir-Book',
      fontSize: 24,
      color: "white",
    },
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#F7F9FB",
    },
    textInput: {
      backgroundColor: "#fff",
      marginBottom: 10,
      borderRadius: 10,
    },
    button: {
      marginTop: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: "#2E3A59",
      backgroundColor: "#fff",
    },
    signInButton: {
      marginTop: 20,
      backgroundColor: "#007AFF",
      borderRadius: 20,
      width: 350,
    },
    saveButton: {
      marginTop: 20,
      backgroundColor: "#007AFF",
     //borderRadius: 20,
      width: 385,
      alignItems: 'center',
      justifyContent: 'center'
    },
    signInButtonText: {
      color: "#707070",
      fontSize: 16,
    },
    buttonLabel: {
      color: "#2E3A59",
      fontWeight: "bold",
      fontSize: 16,
    },
    saveLabel: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
    snackbar: {
      backgroundColor: "#2E3A59",
      borderRadius: 10,
    },
  });
  const Bar = () => {
    return (
      <Appbar.Header style={styles.header}>
        <Appbar.Action
          onPress={navigation.goBack}
          icon="close"
          color="#fff"
        />
        <Appbar.Content
          title="New Equipment"
          titleStyle={styles.title}
        />
      </Appbar.Header>
    );
  };

  return (
    <>
      <Bar />
      <View style={styles.container}>
        <TextInput
          label="Equipment Name"
          value={eventName}
          onChangeText={(name) => setEventName(name)}
          style={styles.textInput}
          autoComplete={false}
        />
        <TextInput
          label="Location (current)"
          value={eventLocation}
          onChangeText={(location) => setEventLocation(location)}
          style={styles.textInput}
          autoComplete={false}
        />
        <TextInput
          label="Equipment Description"
          value={eventDescription}
          multiline={true}
          onChangeText={(desc) => setEventDescription(desc)}
          style={styles.textInput}
          autoComplete={false}
        />
    <TextInput
      label="Price (per 24 hours)"
      value={eventPrice ? `$${eventPrice}` : ""}
      multiline={true}
      onChangeText={handlePriceChange}
      style={styles.textInput}
      prefix="$"
      autoComplete={false}
      keyboardType="numeric"
    />
        <Button
          mode="outlined"
          onPress={showDatePicker}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          {eventDate ? eventDate.toLocaleString() : "Choose a Date"}
        </Button>
        <Button
          mode="outlined"
          onPress={pickImage}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          {eventImage ? "Change Image" : "Select Image"}
        </Button>
        <Button
          mode="contained"
          onPress={saveEvent}
          style={styles.saveButton}
          loading={loading}
          labelStyle={styles.saveLabel}
        >
          Save Event
        </Button>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <Snackbar
          duration={3000}
          visible={visible}
          onDismiss={onDismissSnackBar}
          style={styles.snackbar}
        >
          {message}
        </Snackbar>
      </View>
    </>
  )
}