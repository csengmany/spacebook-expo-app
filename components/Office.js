import React from "react";
import { useNavigation } from "@react-navigation/core";
import { StyleSheet, View, Image, Text, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions } from "react-native";
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function Office({ office }) {
const { width } = useWindowDimensions()
const navigation = useNavigation();
const carouselData = []
office.photos.map((photo,j)=>{
    return carouselData.push({id:office.id+"_"+j, image:{uri:photo.secure_url}})
})
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    description:{
      width:"100%",
      paddingHorizontal:25,
      marginBottom:25,
    },
    bgImage: {
        width: width-50,
        height: 270,
        justifyContent: "flex-end",
        position: "relative",
        borderRadius:10,
    },
     photos: {
        flexDirection: "row",
        flexWrap: "nowrap",
        height: "auto",
        width: width,
        paddingHorizontal:25,
    },
    
    title:{
      fontFamily:"NotoSansMedium",
    },
}); 
return (
    <View style={styles.container}>
      <View style={styles.photos}>
        <SwiperFlatList
          showPagination
          paginationStyle={{
              left: 0,
              right: 0,
              alignItems: "center",
              opacity:0.8,
          }}
          data={office.photos}
          renderItem={({ item }) => {
              return (
                <TouchableWithoutFeedback onPress={() => {
                  navigation.navigate("Office", { officeId: office._id });
                }}>
                  <Image
                      style={styles.bgImage}
                      source={{
                          uri: item.url,
                      }}
                      key={item.public_id}
                  /></TouchableWithoutFeedback>
              );
          }}
        ></SwiperFlatList>
      </View>
      <TouchableOpacity style={styles.description} onPress={() => {
          navigation.navigate("Office", { officeId: office._id });
        }}>
          <Text style={styles.title}>Space {office.title}</Text>
          <Text>
            <Ionicons name="location-outline" size={18} color="black" />
            {office.address}
          </Text>
          <Text>
            <Ionicons name="people-outline" size={16} color="black" /> {office.capacity} 
            <MaterialIcons name="square-foot" size={16} color="black" />{office.surface}
          </Text>
          <Text>{office.price} € par jour</Text>
      </TouchableOpacity> 
    </View>)

}
