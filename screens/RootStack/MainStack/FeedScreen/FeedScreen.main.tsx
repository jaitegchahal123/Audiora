import React, { useState, useEffect } from "react";
import { View, FlatList } from "react-native";
import { Appbar, Button, Card, Headline, Searchbar } from "react-native-paper";
import { getFirestore, collection, query, onSnapshot, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { SocialModel } from "../../../../models/social.js";
import { styles } from "./FeedScreen.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../MainStackScreen.js";
import { getAuth, signOut } from "firebase/auth";

/* 
  Remember the navigation-related props from Project 2? They were called `route` and `navigation`,
  and they were passed into our screen components by React Navigation automatically.  We accessed parameters 
  passed to screens through `route.params` , and navigated to screens using `navigation.navigate(...)` and 
  `navigation.goBack()`. In this project, we explicitly define the types of these props at the top of 
  each screen component.
  Now, whenever we type `navigation.`, our code editor will know exactly what we can do with that object, 
  and it'll suggest `.goBack()` as an option. It'll also tell us when we're trying to do something 
  that isn't supported by React Navigation!
*/
interface Props {
  navigation: StackNavigationProp<MainStackParamList, "FeedScreen">;
}



export default function FeedScreen({ navigation }: Props) {
  // List of social objects
  const [socials, setSocials] = useState<SocialModel[]>([]);
  const [liked, setLiked] = useState("Like");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSocials, setFilteredSocials] = useState<SocialModel[]>([]);

  const auth = getAuth();
  const currentUserId = auth.currentUser!.uid;
  const db = getFirestore();
  const socialsCollection = collection(db, "socials");
  const [heart , setHeart] = useState('heart-outline');


  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    const filteredSocials = socials.filter(
      (social) =>
        social.eventName.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
    setFilteredSocials(filteredSocials);
  };



  useEffect(() => {
    const unsubscribe = onSnapshot(query(socialsCollection, orderBy("eventDate", "asc")), (querySnapshot) => {
      var newSocials: SocialModel[] = [];
        querySnapshot.forEach((social: any) => {
          const newSocial = social.data() as SocialModel;
          newSocial.id = social.id;
          newSocials.push(newSocial);
        });
        setSocials(newSocials);
      });
    return unsubscribe;
  }, []);
  

  const toggleInterested = (social: SocialModel) => {
    // TODO: Put your logic for flipping the user's "interested"
    // status here, and call this method from your "like"
    // button on each Social card.

    if(!social.interested){
      setHeart('heart');
      setLiked("Liked");
    }
    else{
      setHeart('heart-outline');
      setLiked("Like");
    }

    const db = getFirestore();
    const socialsRef = collection(db, "socials");
    const socialRef = doc(socialsRef, social.id);

    updateDoc(socialRef, { interested: social.interested });



  };

  useEffect(() => {
  const db = getFirestore();
  const socialsCollection = collection(db, "socials");

  const unsubscribe = onSnapshot(
    query(socialsCollection, orderBy("eventDate", "asc")),
    (querySnapshot) => {
      const socials: SocialModel[] = [];

      querySnapshot.forEach((doc) => {
        const social = doc.data() as SocialModel;
        social.id = doc.id;
        socials.push(social);
      });

      setSocials(socials);
    }
  );

  return unsubscribe;
}, []);

const renderSearch = () => {
  return (
    <View style={{marginHorizontal: 16, marginVertical: 8}}>
      <Searchbar
        placeholder="Search events..."
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
    </View>
  );
};

  const renderSocial = ({ item }: { item: SocialModel }) => {
    const onPress = () => {
      navigation.navigate("DetailScreen", {
        social: item,
      });
    };

    return (
      <Card onPress={onPress} style={{ margin: 16 }}>
        <Card.Cover source={{ uri: item.eventImage }} />
        <Card.Title
          title={item.eventName}
          subtitle={
            item.eventLocation +
            " • " +
            new Date(item.eventDate).toLocaleString()
          }
        />
        {/* TODO: Add a like/interested button & delete soccial button. See Card.Actions
              in React Native Paper for UI/UX inspiration.
              https://callstack.github.io/react-native-paper/card-actions.html */
              }
        <Card.Actions>
          <Button icon={heart} onPress={() => toggleInterested(item)}> {liked} </Button>
          {/* <Button color = "red" onPress={() => deleteSocial(item)}> Delete from Feed</Button> */}
          <Button color = "black" > Description</Button>
        </Card.Actions>
      </Card>
    );
  };

  const Bar = () => {
    return (
      <Appbar.Header style={{ backgroundColor: "white" }}>
        <Appbar.Action
          icon="exit-to-app"
          onPress={() => signOut(auth)}
        />
        <Appbar.Content
          title="Audiora"
          titleStyle={{ fontSize: 24, fontFamily: "Avenir-Book", color: "black" }}
        />
        <Appbar.Action
          icon="plus"
          onPress={() => {
            navigation.navigate("NewSocialScreen");
          }}
        />
      </Appbar.Header>
    );
  };

  return (
    <>
      <Bar />
      <View style={{ flex: 1, marginTop: 8 }}>
      <FlatList
      data={filteredSocials.length > 0 ? filteredSocials : socials} 
      renderItem={renderSocial}
      keyExtractor={(social) => social.id}
      ListHeaderComponent = {renderSearch()}
    />
</View>
    </>
  );
}