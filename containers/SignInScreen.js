import { useNavigation } from "@react-navigation/core";
import { ActivityIndicator, Button, Text, TextInput, View, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Input from "../components/Input";
import colors from "../assets/colors";
const { red, white } = colors;

export default function SignInScreen({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const server = "http://192.168.68.104:3002"
  //"https://spacebook-backend-94816fa1b759.herokuapp.com"

  const submit = async () => {
    if (email && password) {
        if (error !== "") {
            setError("");
        }
        try {
            setIsLoading(true);
            const response = await axios.post(
                    `${server}/user/login`,
                    { email, password }
                )

            if (response.data.token) {
                setIsLoading(false);
                setToken(response.data.token)
            }
        } catch (error) {
          console.log(error)
          setIsLoading(false);
        }
    } else {
        setError("Remplissez tous les champs");
    }
  };

  return (
    <View style={styles.container}>
        <Input
              placeholder="email"
              boolean={false}
              setFunction={setEmail}
          />
          <Input
              placeholder="password"
              secure={visibility}
              setSecure={setVisibility}
              setFunction={setPassword}
          />
        
        <Text >{error}</Text>
        
        <TouchableOpacity
          style={[styles.btn, styles.bg]}
          onPress={()=>{submit()}}
        >
        <Text style={[styles.text]}>Se connecter {isLoading && <ActivityIndicator color="#FFF" />}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignUp");
          }}
        >
          <Text>S'inscrire</Text>
        </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    text: {
        color: white,
        textAlign: "center",
        fontFamily:"NotoSansBold"
    },
    btn: {
        height: 50,
        borderStyle: "solid",
        borderWidth: 3,
        borderColor: red,
        borderRadius: 5,
        marginVertical: 10,
        width: "50%",
        justifyContent: "center",
        alignItems: "center",
    },
    color: {
        color: white,
    },
    bg: {
        backgroundColor: red,
    },
});