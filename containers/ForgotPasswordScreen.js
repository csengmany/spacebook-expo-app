import React, { useState } from "react";
import {ActivityIndicator, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import InputCustom from "../components/InputCustom";
import axios from "axios";
import validator from "validator";
import colors from "../assets/colors";
const { red, green } = colors;

export default function ForgotPasswordScreen() {
    const server = "http://192.168.1.37:3002"
  //"https://spacebook-backend-94816fa1b759.herokuapp.com"

    const [email, setEmail] = useState("");
    const [loading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const [status, setStatus] = useState("")

    const submitForgotPassword = async () => {
        try {
            if(validator.isEmail(email)){
                setErrorMessage("")
                setStatus()
                setIsLoading(true)
                const response = await axios.post(`${server}/user/forgot-password`,{email})
                if (response) {
                    setStatus(response.status)
                    setIsLoading(false)
                }
            }else setErrorMessage("E-mail invalide")
        } catch (error) {
            setIsLoading(false)
            setErrorMessage("Il n'y a pas de compte associé à cette adresse mail")
            console.log(error)
        }
    }

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <InputCustom
            type="text"
            placeholder="E-mail"
            boolean={false}
            setFunction={setEmail}
        />
        <Text style={[styles.message, errorMessage?styles.error:styles.success]}>
            {errorMessage ? errorMessage : status ===200?
            "Un mail de réinitialisation de mot de passe vous a été envoyé":""}
        </Text>
        <TouchableOpacity
          style={[styles.btn, styles.bg]}
          disabled={loading}
          onPress={()=>{submitForgotPassword()}}
        >
            <Text style={[styles.text, styles.bold]}>Réinitialiser {loading && <ActivityIndicator color="#FFF" />}</Text>
        </TouchableOpacity>
      </View>
    </View>
    
  );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#FFF",
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    center:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: "#FFF",
        textAlign: "center",
        fontSize:18
    },
    btn: {
        height: 50,
        borderRadius: 5,
        marginVertical:10,
        padding:10,
        width: "50%",
        justifyContent: "center",
        alignItems: "center",
    },
    bg: {
        backgroundColor: red,
    },
    bold:{
      fontFamily:"NotoSansBold"
    },
    message :{
        color:green,
        marginVertical:5,
        textAlign:"center",
        fontFamily:"NotoSans",
        fontSize:16,
        paddingHorizontal:20
    },
    success:{
        color:green,
    },
    error:{
        color:"red"
    }
});