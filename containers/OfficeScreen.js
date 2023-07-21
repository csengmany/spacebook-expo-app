import { useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import { Image, Text, View, StyleSheet, useWindowDimensions, ScrollView } from "react-native";
import axios from "axios"
import React, { useEffect, useState }  from "react"
import Loader from "../components/Loader";
import MapView, { Marker } from "react-native-maps";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import { FontAwesome, Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../assets/colors";
const { red,lightgray, black } = colors;



export default function OfficeScreen() {
  const route = useRoute();
  const { id, date } = route.params;
  const navigation = useNavigation();

  const { width } = useWindowDimensions()

  const [officeData, setOfficeData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [selectedDate, setSelectedDate] = useState(date??null)
  const [location, setLocation] = useState({})
  const server = "http://192.168.68.104:3002"
  //"https://spacebook-backend-94816fa1b759.herokuapp.com"
  
  const handleBookClick = () => {
    // navigate(`/payment/${id}`, {
    //     state: {office: officeData, 
    //     date: Date.parse(selectedDate)}
    // })
  }

  const styles = StyleSheet.create({
    container:{
      backgroundColor: '#ffffff',
      flex:1,
    },
    officeContainer: {
      display:"flex",
      justifyContent:"center",
      alignItems:"flex-start",
    },
    description:{
      width:"100%",
      paddingHorizontal:25,
      marginBottom:25,
    },
    bgImage: {
        width: width,
        height: 270,
    },
     photos: {
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        width: width,
        paddingHorizontal:25,
    },
    title:{
      fontSize:24,
      fontFamily:"NotoSansMedium",
    },
    subTitle:{
      marginTop:15,
      marginBottom:10,
      fontSize:18,
      fontFamily:"NotoSansMedium",
    },
    priceContainer:{
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      paddingHorizontal:25,
      height:70,
      borderTopWidth: 1, 
      borderTopColor:lightgray,
    },
    services:{
      display:"flex",
      flexDirection:"row",
      justifyContent:"flex-start",
      alignItems:"center",
      flexWrap:"wrap",

    },
    service:{
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      margin:5,
    },
     mapView: {
        height: 200,
        width: "100%",
    },
}); 

  useEffect(() => {
      //axios request
      const fetchData = async () => {
          try {
              const response = await axios.get(`${server}/office/${id}`)
              setOfficeData(response.data)
              setLocation({lat:response.data.location[0],lng:response.data.location[1]})
              setIsLoading(false)
          } catch (error) {
              console.log(error)
          }
      }
      fetchData()
    }, [isLoading, id])

  return  isLoading?  <Loader />
    :
    <View style={styles.container} >
      <ScrollView>
        <View style={styles.officeContent}>
          <View style={styles.photos}>
            <SwiperFlatList
            style={{width:width}}
              showPagination
              paginationStyle={{
                left: 0,
                right: 0,
                alignItems: "center",
                opacity:0.8,
              }}
              data={officeData.photos}
              renderItem={({ item }) => {
                  return (
                      <Image
                          style={styles.bgImage}
                          source={{
                              uri: item.url,
                          }}
                          key={item.public_id}
                      />
                  );
              }}
            ></SwiperFlatList>
          </View>
          <View style={styles.description}>
            <Text style={styles.title}>Space {officeData.title}</Text>
            <Text>
              <Ionicons name="location-outline" size={18} color="black" />
              {officeData.address}
            </Text>
            <Text>
                <Ionicons name="people-outline" size={16} color="black"/> {officeData.capacity} &nbsp; 
                <MaterialCommunityIcons name="set-square" size={16} color="black"/>{officeData.surface}m²
            </Text>
            <Text style={styles.subTitle}>Description</Text>
            <Text>{officeData.description}</Text>
            <Text style={styles.subTitle}>Prestations offertes</Text>
            <View style={styles.services}>
              {officeData.services.wifi && <View style={styles.service}>
                <Ionicons name="wifi-outline" size={24} color="black" />
                <Text>Wifi</Text>
              </View>}
               {officeData.services.coffee &&<View style={styles.service}>
                  <MaterialCommunityIcons name="coffee-maker-outline" size={24} color={black} />
                <Text>Thé & café</Text>
              </View>}
               {officeData.services.water && <View style={styles.service}>
              <Ionicons name="water-outline" size={24} color={black} />
                <Text>Fontaine à eau</Text>
              </View>}
               {officeData.services.wc &&<View style={styles.service}>
                <MaterialIcons name="wc" size={24} color="black" />                
                <Text>Toilettes</Text>
              </View>}
              {officeData.services.elevator &&<View style={styles.service}>
                <MaterialCommunityIcons name="elevator-passenger-outline" size={24} color={black} />
                <Text>Ascenseur</Text>
              </View>}

            </View>
 
            <Text style={styles.subTitle}>Équipements du Space</Text>
            <View style={styles.services}>
              {officeData.equipments.tv &&<View style={styles.service}>
                <FontAwesome name="tv" size={24} color={black} />
                <Text>Écran TV</Text>
              </View>}
                {officeData.equipments.whiteboard &&<View style={styles.service}>
                <MaterialCommunityIcons name="presentation" size={24} color={black} />
                <Text>Tableau blanc</Text>
              </View>}
                {officeData.equipments.projector &&<View style={styles.service}>
                <Ionicons name="videocam-outline" size={24} color={black} />
                <Text>Vidéo-projecteur</Text>
              </View>}
                {officeData.equipments.ac &&<View style={styles.service}>
                <FontAwesome name="snowflake-o" size={24} color={black} />
                <Text>Climatiseur</Text>
              </View>}
            </View>
            <Text style={styles.subTitle}>Où se situe le Space</Text>
            <MapView
                style={styles.mapView}
                initialRegion={{
                    latitude: officeData.location[0],
                    longitude: officeData.location[1],
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }}
                showsUserLocation={true}
            >
                <Marker
                    coordinate={{
                        latitude: officeData.location[0],
                        longitude: officeData.location[1],
                    }}
                />
          </MapView>

        </View>
      </View>
      </ScrollView>
      <View style={styles.priceContainer}>
        <Text>{officeData.price} € par jour</Text> 
      </View>
    </View>
}

