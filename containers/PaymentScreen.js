import React, { useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/core";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View, Text, Image, useWindowDimensions,ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useConfirmPayment,StripeProvider,CardField } from '@stripe/stripe-react-native';
import colors from "../assets/colors";
import axios from "axios";
const { green, darkgray, lightgray } = colors;

export default function PaymentScreen({userJson, date}) {
  const route = useRoute();
  const navigation = useNavigation();
  const { office } = route.params;
  const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
  }

  // const server = "http://192.168.1.24:3002"
  const server = "https://spacebook-backend-94816fa1b759.herokuapp.com"
  
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const[cardDetails, setCardDetails] = useState()
  const [message, setMessage] = useState('');
  const { width } = useWindowDimensions()

  const navigateHome = () => {
    navigation.navigate("Home")
  }
  const paymentSheetURL = `${server}/create-payment-sheet`;

  const {confirmPayment, loading} = useConfirmPayment()
  const handlePayPress = async () => {
    setMessage("")
    setErrorMessage("")
    if(!cardDetails?.complete){
      setErrorMessage("Veuillez compléter tous les champs")
      return;
    }
    try {
      setLoading(true)
      // create payment sheet for stripe payment
      const response = await axios.post(paymentSheetURL, {office, user:{lastname:JSON.parse(userJson).lastname, email:JSON.parse(userJson).email}},
        { headers: {"Content-Type": "application/json"} })
      if(response){
        //confirm payment
        const {paymentIntent, error} = await confirmPayment
        (
          response.data.clientSecret,{
            type: "Card",
            paymentMethodType:"Card"
          }
        )
        if(error)
        {
          setErrorMessage("Une erreur s'est produite, veuillez-réessayer")
          console.log("Error : ", error)
        }
        else if(paymentIntent){
          // successful payment : create the booking
          const bookingResponse = await axios.post(`${server}/booking/create/${office._id}`, {date, amount:office.price},{headers: {
            Authorization: "Bearer " + JSON.parse(userJson).token,
            "Content-Type": "application/json",
          }});
          if(bookingResponse){
            setMessage("Paiement réussi. Merci pour votre réservation.")
            console.log("payment successful", paymentIntent)
          }
        }
        else {
          setErrorMessage("Une erreur s'est produite, veuillez-réessayer")
          console.log("problem")
        }
      }else{
        setErrorMessage("Une erreur s'est produite, veuillez-réessayer")
        console.log("can not fetch payment intent")
      }
      setLoading(false)
    }catch(e){
      setLoading(false)
      setErrorMessage("Une erreur s'est produite, veuillez-réessayer")
      console.log(e)
    }
  }
  const styles = StyleSheet.create({
      container: {
        flex:1,
        backgroundColor:"#FFF",
        paddingHorizontal:20,
      },
      input : {
        borderColor : lightgray,
        borderWidth:1,
        borderRadius:5,
        fontFamily:"NotoSans",
        fontSize:16,
        height:50,
        padding:10,
        marginTop:15
      },
      card:{
        borderColor:lightgray,
        borderWidth:1,
      },
      cardContainer:{
        height: 50,
        marginVertical: 15,
      },
      image:{
        height:300,
        width:width,
        marginLeft:-20
      },
      title:{
        fontFamily:"NotoSansBold",
        textDecorationLine:"underline",
        fontSize:20,
        marginTop:10,
      },
      subtitle:{
        fontFamily:"NotoSansMedium",
        textDecorationLine:"underline",
        fontSize:18,
        marginTop:10,
      },
      btn: {
        height: 50,
        width: width-40,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        marginTop:15,
        marginBottom:30
      },
      greenBtn:{
        backgroundColor: green,
      },
      greyBtn:{
        backgroundColor: darkgray,
      },
      text:{
        fontFamily:"NotoSans",
        fontSize:16,
        marginTop:2,
      },
      bold:{
        fontFamily:'NotoSansBold',
        fontSize:20
      },
      btnTxt:{
        fontFamily:'NotoSansBold',
        color:"#FFF",
        fontSize:20
      },
      message:{
        marginBottom:20,
        fontFamily:"NotoSansMedium",
        fontSize:18
      },
      success:{
        color:green,
      },
      error:{
        color:"red",
      }
  })

  return (
  <ScrollView>
    <StripeProvider
      publishableKey="pk_test_51ILRIOC07VZW5a1iIHvpLpxNXcunRjmn3Or0CrkK0RjTB9v4DKnNKAFRcFiLon5aIEfQ2sjXGND9mlJ3lIi4oU2g00FUNAm9UH"
    >
      <View style={styles.container}> 
        <Image
          style={styles.image}
          source={{
              uri: office.photos[0].secure_url,
          }}
        />
        <Text style={styles.title}>Les détails de votre réservation :</Text>
        <Text style={styles.subtitle}>Space {office.title}</Text>
        <Text style={styles.text}>
            <Ionicons name="location-outline" size={18} color="black" />
            {office.address}
        </Text>
        <Text style={styles.text}>
            <Ionicons name="people-outline" size={18} color="black"/> {office.capacity} &nbsp; 
            <MaterialCommunityIcons name="set-square" size={18} color="black"/>{office.surface}m²
        </Text>
          <Text style={styles.text}>Date : {new Date(date).toLocaleDateString("fr-FR",options)}</Text>
          <Text style={styles.text}>Montant : <Text style={styles.bold}>{office.price} €</Text></Text>
        <View>
            <Text style={styles.subtitle}>Paiement par carte bancaire</Text>
            <CardField
              postalCodeEnabled={false}
              placeholders={{
                number: '4242 4242 4242 4242',
              }}
              cardStyle={styles.card}
              style={styles.cardContainer}
              onCardChange={(cardDetails) => {
                console.log('cardDetails', cardDetails);
                setCardDetails(cardDetails)
              }}
              onFocus={(focusedField) => {
                console.log('focusField', focusedField);
              }}
            />
            {message && <Text style={[styles.message,styles.success]}>{message}</Text>}
            {errorMessage && <Text style={[styles.message,styles.error]}>{errorMessage}</Text>}
            <TouchableOpacity
              style={isLoading?[styles.greyBtn, styles.btn]:[styles.greenBtn,styles.btn]}
              onPress={message?navigateHome:handlePayPress}
              disabled={loading}
            >
            <Text style={styles.btnTxt}>{message?"Retour à l'accueil":"Payer"} {loading&& <ActivityIndicator/>}</Text>
            </TouchableOpacity>
        </View>
      </View>
    </StripeProvider>
  </ScrollView>
  );
}