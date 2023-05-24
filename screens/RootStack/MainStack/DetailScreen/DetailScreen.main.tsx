import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { ScrollView, Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Appbar } from "react-native-paper";
import { MainStackParamList } from "../MainStackScreen";
import NewSocialScreen from "/Users/jaitegchahal/final3B/screens/RootStack/NewSocialScreen/NewSocialScreen.main"



interface Props {
  navigation: StackNavigationProp<MainStackParamList, "DetailScreen">;
  route: RouteProp<MainStackParamList, "DetailScreen">;
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20
  },
  view: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#CCCCCC'
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5
  },
  payNowButton: {
    backgroundColor: "#4caf50",
    borderRadius: 10,
    margin: 20,
    marginBottom: 100,
    padding: 10,
  },
  payNowButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 20
  }
});

export default function DetailScreen({ route, navigation }: Props) {
  const { social } = route.params;

  const Bar = () => {
    return (
       <Appbar.Header style={{ backgroundColor: "#CDCDCD" }}>
        <Appbar.BackAction onPress={() => navigation.navigate("FeedScreen")} />
    
        <Appbar.Content
          title = "Description"
          titleStyle={{ fontSize: 24, fontFamily: "Avenir-Book", color: "black" }}
        />
      </Appbar.Header>
    );
  };
  
  return (
    <>
<Bar />
  <ScrollView style={styles.container}>
    <View style={styles.view}>
      <Image style={styles.image} source={{ uri: social.eventImage }} />
      <Text style={styles.title}>{social.eventName}</Text>
      <Text style={styles.subtitle}>{social.eventLocation}</Text>
      <Text style={styles.subtitle}><Text style={{fontWeight: 'bold'}}>Listed Time:</Text> {new Date(social.eventDate).toLocaleString()}</Text>
      <Text style={styles.subtitle}><Text style={{fontWeight: 'bold'}}>Price: $</Text>{social.eventPrice}</Text>
      <Text style={styles.body}>{social.eventDescription}</Text>
    </View>
  </ScrollView>
  <TouchableOpacity style={styles.payNowButton} 
         >
        <Text style={styles.payNowButtonText}>Pay Now</Text>
      </TouchableOpacity>
      
</>
  );
}
