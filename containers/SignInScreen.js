import { useNavigation } from "@react-navigation/core";
import { ActivityIndicator, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import InputCustom from "../components/InputCustom";
import validator from "validator";
import colors from "../assets/colors";
const { red } = colors;

export default function SignInScreen({ setToken }) {
  const server = "http://192.168.1.37:3002"
  //"https://spacebook-backend-94816fa1b759.herokuapp.com"

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const submitSignIn = async () => {
    const isValidEmail = validator.isEmail(email)
    if(!isValidEmail)
      setErrorMessage("E-mail invalide")
      
    else if (email && password) {
        if (errorMessage !== "") {
            setErrorMessage("");
        }
        try {
            setIsLoading(true);
            const response = await axios.post(`${server}/user/login`,{ email, password })
            if (response.data.token) {
                setIsLoading(false);
                setToken(response.data.token)
            }
        } catch (error) {
          console.log(error)
          setErrorMessage("Identifiants invalides");
          setIsLoading(false);
        }
      } else {
          setErrorMessage("Remplissez tous les champs");
      }
  };

  return (
    <View style={styles.container}>
        <InputCustom
              type="text"
              placeholder="E-mail"
              boolean={false}
              setFunction={setEmail}
          />
          <InputCustom
              type="password"
              placeholder="Mot de passe"
              secure={visibility}
              setSecure={setVisibility}
              setFunction={setPassword}
          />
        
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        
        <TouchableOpacity
          style={[styles.btn, styles.bg]}
          disabled={isLoading}
          onPress={()=>{submitSignIn()}}
        >
        <Text style={[styles.text, styles.bold]}>Se connecter {isLoading && <ActivityIndicator color="#FFF" />}</Text>
        </TouchableOpacity>
       <TouchableOpacity
          onPress={() => {
            navigation.navigate("ForgotPassword");
          }}
        > 
          <Text style={[styles.link]}>Mot de passe oublié ?</Text>
        </TouchableOpacity>


        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignUp");
          }}
        >
          <Text>Vous n'avez pas de compte ? <Text style={[styles.link, styles.bold]}>Inscription</Text></Text>
        </TouchableOpacity>
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
    text: {
        color: "#FFF",
        textAlign: "center",
        fontSize:18,
    },
    btn: {
        height: 50,
        borderStyle: "solid",
        borderRadius: 5,
        marginTop:20,
        marginBottom: 10,
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
    link:{
      textDecorationLine:"underline",
      marginVertical:5,
    },
    error:{
      marginTop:5,
      color:"red"
    }
});