import React, { useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/core";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View, Text, Image, useWindowDimensions,ScrollView, TouchableOpacity, Button } from "react-native";
import { useStripe } from '@stripe/stripe-react-native';
import colors from "../assets/colors";
import axios from "axios";
const { green } = colors;

export default function PaymentScreen({userToken}) {
  const route = useRoute();
  const navigation = useNavigation();
  const { office, date } = route.params;
  const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
  }

  const server = "http://192.168.1.37:3002"
  //"https://spacebook-backend-94816fa1b759.herokuapp.com"
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const { width } = useWindowDimensions()

  const navigateHome = () => {
    navigation.navigate("Home")
  }

  const handleCreatePayment = async () => {
    setLoading(true);
    try {
      // Endpoint URL to create PaymentSheet on your server
      const paymentSheetURL = `${server}/create-payment-sheet`;
      const secretKey = "sk_test_51ILRIOC07VZW5a1itQ3W2qpNPzlVb7wuKExUhSZejCdtMM0x7hC4QSEVWDScog5OMBLrr5AB6fKO9wYk6y58eHJR00WGC9Y0wZ"
      // Make a POST request to create the PaymentSheet
      const response = await axios.post(paymentSheetURL,{office},
        {headers: {
        Authorization: "Bearer " + secretKey,
        "Content-Type": "application/json",
      }}
      );
      console.log("Server Response:", response.data);
      
      // Initialize PaymentSheet
      await initPaymentSheet({
        paymentSheetURL: paymentSheetURL,
        paymentIntentClientSecret: response.data.clientSecret, // Use the clientSecret received from the server
      });
      const { error } = await presentPaymentSheet().catch((error) => {
        console.log("Error presenting PaymentSheet:", error);
      });

      // Present PaymentSheet to user
      if (error) {
        // setErrorMessage("Une erreur s'est produite, veuillez réessayer")
        console.log("Error processing payment: ", error);
      } else {
        //Payment successful : create the booking
        const bookingResponse = await axios.post(`${server}/booking/create/${office._id}`, {date},{headers: {
          Authorization: "Bearer " + userToken,
          "Content-Type": "application/json",
        }});
        if(bookingResponse){
          setLoading(false);
          setMessage("Paiement réussi. Merci pour votre réservation.")
          console.log("Payment completed successfully");
        }
      }
    } catch (error) {
      setErrorMessage("Une erreur s'est produite, veuillez réessayer")
      setLoading(false);
      console.log("Error initializing PaymentSheet: ", error);
    }
  };


  const styles = StyleSheet.create({
      container: {
        flex:1,
        backgroundColor:"#FFF",
        paddingHorizontal:20,
      },
      image:{
        height:300,
        width:width,
        marginLeft:-20
      },
      title:{
        fontFamily:"NotoSansMedium",
        fontSize:20,
        marginTop:20,
      },
      subtitle:{
        fontFamily:"NotoSansMedium",
        fontSize:16,
        marginTop:20,
      },
      btn: {
        height: 50,
        width: width-40,
        borderStyle: "solid",
        borderWidth: 3,
        borderColor: green,
        backgroundColor: green,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
      },
      text:{
        fontFamily:"NotoSans",
        fontSize:16,
        marginTop:5,
      },
      textBtn:{
        fontFamily:'NotoSansBold',
        color:"#FFF",
        fontSize:20
      },
      success:{
        marginTop:10,
        color:green,
        fontFamily:"NotoSansMedium",
        fontSize:18
      },
      error:{
        marginTop:10,
        color:"red",
        fontFamily:"NotoSansMedium",
        fontSize:18
      }
  });
  return (
    <ScrollView>
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
        <Text style={styles.text}>Réserver la journée du {new Date(date).toLocaleDateString("fr-FR",options)}</Text>
        <Text style={styles.text}>Montant {office.price} €</Text>
      <View>
      <Text style={styles.success}>{message}</Text>
      <Text style={styles.error}>{errorMessage}</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={message?navigateHome:handleCreatePayment}
        disabled={loading}
      >
        <Text style={styles.textBtn}>{message?"Retour à l'accueil":"Payer par carte"}</Text>
      </TouchableOpacity>
      </View>
    </View>
  </ScrollView>
  );
}