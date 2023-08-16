import { useNavigation } from "@react-navigation/core";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View, StyleSheet, RefreshControl, TouchableOpacity, useWindowDimensions } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import axios from "axios";
import colors from "../assets/colors";
import ConfirmationModal from "../components/ConfirmationModal";
const { red, green, lightgray, darkgray} = colors;

export default function BookingsScreen({userJson}) {
    // const server = "http://192.168.1.24:3002"
    const server = "https://spacebook-backend-94816fa1b759.herokuapp.com"
    const navigation = useNavigation();
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isBookingCancelled, setIsBookingCancelled] = useState(false)
    const [displayModal, setDisplayModal] = useState(false)
    const [cancelationId, setCancelationId] = useState(null)
    const [errorMessage, setErrorMessage] = useState("")
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { height: viewportHeight} = useWindowDimensions();
  
    //function to check if booking is cancellable
    const isCancellable = (booking) => { 
      if(booking.type==="booked"){
        //booking is cancellable until the day before rental date
        const rentalDay = new Date(booking.rental_date)
        const dayBeforeRental = new Date(rentalDay)
        dayBeforeRental.setDate(rentalDay.getDate() - 1)
        // before midnight
        dayBeforeRental.setHours(23, 59, 59, 59)
        //compare timestamp of now is with timestamp of one day before rental date
        return new Date(Date.now()).getTime() < new Date(dayBeforeRental).getTime() 
      }
      return false
    }
    //function to check if booking is today
    const isToday = (booking) =>{
      return booking.type==="booked" &&
      new Date().toLocaleDateString("fr-FR" )=== new Date(booking.rental_date).toLocaleDateString("fr-FR")
    }

    useEffect(() => {
      //axios request
      const fetchData = async () => {
            setIsRefreshing(false);
        try {
          setIsLoading(true)
          const response = await axios.get(`${server}/booking-history`,
          {headers: {Authorization: "Bearer " + JSON.parse(userJson).token, "Content-Type": "application/json"}})
          if(response){
            setData(response.data)
            setIsLoading(false)
          }
        } catch (error) {
          console.log(error)
        }
      }
      fetchData()
        // check if isBookingCancelled and refetch data
        if (isBookingCancelled) {
          fetchData()
          setIsBookingCancelled(false) // reset isBookingCancelled to false
        }
    }, [userJson, isRefreshing])
    const closeModal = () =>{
        setDisplayModal(false)
        setCancelationId(null)
        setErrorMessage("")
    }
    const handleCancelClick = (bookingId)=>{
        setDisplayModal(true)
        setCancelationId(bookingId)
    }
    const handleConfirmCancelation= async ()=>{
        try{
            setIsLoading(true)
            const response = await axios.put(`${server}/booking-history/cancel/${cancelationId}`,{},
                {headers: {Authorization: "Bearer " + JSON.parse(userJson).token, "Content-Type": "application/json"}})
            if(response.status===200){
                setIsLoading(false)
                setCancelationId(null)
                setIsBookingCancelled(true)
            }
        }catch (error) {
            console.log(error.response)
            setErrorMessage("Une erreur s'est produite")
        }
    }
  return (
    <ScrollView 
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={()=>{setIsRefreshing(true)}} />
      }
    >

          {displayModal && 
          <ConfirmationModal 
            displayModal={displayModal}
            isLoading={isLoading}
            errorMessage={errorMessage}
            closeModal={closeModal}
            handleConfirmCancelation={handleConfirmCancelation}
            isBookingCancelled={isBookingCancelled}
            setIsRefreshing={setIsRefreshing}
          />}
            {isLoading ? 
                <Text><ActivityIndicator color={red}/></Text>
            :<View style={[styles.container, {minHeight:viewportHeight}]}>
                  {data?.bookings.map((booking, i)=>{
                    const formattedDate = new Date(booking.rental_date).toLocaleDateString("fr-FR",{
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })
                    const cancellable = isCancellable(booking)
                    const today = isToday(booking)
                    return <View style={styles.bookingCard} key={i}>
                        <View style={styles.row1}>
                          <TouchableOpacity
                          onPress={()=> navigation.navigate("Office", { id: booking.office._id, date: ''}) }
                          >
                          <Image 
                            style={styles.photo}
                            source={{uri: booking.office.photos[0].secure_url}}
                          />
                          </TouchableOpacity>
                          <View style={styles.details}>
                            <View style={styles.details1}>
                              <Text style={styles.title}>Space {booking.office.title} </Text> 
                              <Text style={[styles.text, styles.dark]}>{formattedDate} </Text>
                              <Text style={[styles.text, styles.dark]}>{booking.type==="booked"?"Honorée":"Annulé"}</Text>
                            </View>
                          </View>
                          <Text style={styles.price}>{booking.amount} €</Text>
                        </View>
                        <View style={styles.row2}>
                          {today ? <Text style={styles.success}>En cours</Text> :
                           <TouchableOpacity
                          onPress={()=> cancellable? handleCancelClick(booking._id): navigation.navigate("Office", { id: booking.office._id, date: ''}) }
                          >
                            <Text style={styles.link} >{cancellable? "Annuler ma réservation":
                            booking.type==="cancelled"?"Réserver ce Space ?":"Réserver à nouveau"}</Text>
                          </TouchableOpacity>}
                        </View>
                    </View>
                  })}
                  {data.count===0 && <Text style={{textAlign:"center", marginTop:100}}>Vous n'avez pas encore de réservations.</Text>}
            </View>}

    </ScrollView>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"#FFF",
      padding:15,
    },
    row1:{
      display:"flex",
      flexDirection:"row",
      justifyContent:"space-between",
      alignItems:"center",
      borderBottomColor:lightgray,
      borderBottomWidth:1,
      padding:15
    },
    row2:{
      padding:15
    },
    bookingCard:{
      borderWidth:1,
      borderColor:lightgray,
      borderRadius:5,
      marginBottom:20
    },
    photo:{
      borderRadius:5,
      height:100,
      width:100,
    },
    text: {
        fontFamily:"NotoSans",
        color: "#000",
        fontSize:14,
    },
    title: {
      fontFamily:"NotoSans",
      color: "#000",
      fontSize:16,
    },
    price:{
      fontFamily:"NotoSansMedium",
      color: "#000",
      fontSize:14,
    },
    dark:{
      color:"black"
    },
    btn: {
        height: 50,
        borderRadius: 5,
        marginTop:20,
        marginBottom: 30,
        width: "50%",
        justifyContent: "center",
        alignItems:"center",
        paddingHorizontal:10,
    },
    bg: {
        backgroundColor: red,
    },
    bold:{
      fontFamily:"NotoSansBold"
    },
    link:{
      textDecorationLine:"underline",
      marginVertical:5,
    },
    message :{
        color:green,
        marginVertical:5,
        textAlign:"center",
        fontFamily:"NotoSans",
        fontSize:16,
        paddingHorizontal:25
    },
    success:{
        color:green,
    },
    error:{
        color:"red"
    },
    picture: {
      height: 110,
      width: 110,
      borderRadius: 110,
    },
    pictureView: {
      marginTop: 15,
      width: 120,
      height: 120,
      borderRadius: 120,
      alignItems: "center",
      justifyContent: "center",
      borderColor: lightgray,
      borderWidth: 2,
    },
    topView: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 0,
    },
    icons: {
        marginLeft: 20,
    },
    iconButton: {
        marginTop: 40,
    },
    title:{
      fontFamily:"NotoSansMedium",
      fontSize:18
    },
    marginTop:{
      marginTop:25
    },
    disabled :{
      backgroundColor:darkgray
    }
});