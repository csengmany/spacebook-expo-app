import { ActivityIndicator, Text, View,Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import InputCustom from "../components/InputCustom";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import validator from "validator";
import colors from "../assets/colors";
const { red, green, lightgray, darkgray} = colors;

export default function SignUpScreen( ) {

  // const server = "http://192.168.1.24:3002"
  const server = "https://spacebook-backend-94816fa1b759.herokuapp.com"

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [visibilityConfirm, setVisibilityConfirm] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [picture, setPicture] = useState(null);
  const [isPictureModified, setIsPictureModified] = useState(false);

  const submitSignUp = async () => {
      setErrorMessage("")
      setMessage("")
    if(!validator.isEmail(email))
      setErrorMessage("E-mail invalide")
    else if(!validator.isMobilePhone(phone))
      setErrorMessage("Téléphone invalide")
    else if(password!==confirmPassword)
      setErrorMessage("Les mots de passe ne sont pas identiques")
    else if (email && username && lastname && firstname && phone && password) {
        try {
            setIsLoading(true);
            const formData = new FormData()
            if(picture){
              const uri = picture;
              const uriParts = uri.split(".");
              const fileType = uriParts[1];

              formData.append("avatar", {
                uri,
                name: `userAvatar`,
                type: `image/${fileType}`,
              });
            }
              formData.append("email", email)
              formData.append("username", username)
              formData.append("lastname", lastname)
              formData.append("firstname", firstname)
              formData.append("phone", phone)
              formData.append("password", password)
            const response = await axios.post(`${server}/user/signup`, formData,
            {
              headers: {
                  "Content-Type": "multipart/form-data",
              },
            })
            if (response.data.token) {
                setIsLoading(false);
                setMessage("Vous allez recevoir un e-mail pour valider la création de votre compte.")
            }
        } catch (error) {
          if (error.response) {
            if(error.response.data.message==="You must send Image")
                setErrorMessage("Vous devez envoyer une image")
            else if(error.response.data.message==="Change username, it is already used")
                setErrorMessage("Ce nom d'utilisateur est déjà utilisé")
            else if(error.response.data.message==="Change email, it is already used")
                setErrorMessage("Cet email est déjà utilisé")
            else if(error.response.data.message==="Invalid email format")
                setErrorMessage("E-mail invalide")
            else if(error.response.data.message==="Invalid phone number format")
                setErrorMessage("Numéro de téléphone invalide")
            else if(error.response.data.message==="Invalid firstname or lastname format (permitted characters are letters and -)")
                setErrorMessage("Nom et/ou prénom invalide (caractères autorisés lettre et -)")
            else if(error.response.data.message==="Invalid username format (permitted characters are letters, numbers and -)")
                setErrorMessage("Nom d'utilisateur invalide (caractères autorisés lettre, chiffres et -)")
            else if(error.response.data.message==="Invalid password format (Minimum length of 8 characters with at least 1 lowercase, 1 uppercase, 1 numeric and 1 special character)")
                setErrorMessage("Format du mot de passe invalide : 8 caractères minimum dont 1 minuscule, 1 majuscule, 1 chiffre et 1 symbole")
            else setErrorMessage(error.response.data.message)
          }
          setIsLoading(false);
        }
      } else {
          setErrorMessage("Remplissez tous les champs");
      }
  };
   // get picture from image library
    const uploadPicture = async () => {
      try{
        setErrorMessage("")
        setMessage("")
        const {
            status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status === "granted") {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (result?.assets?.length) {
              setPicture(result.assets[0].uri)
              if (!isPictureModified) {
                  setIsPictureModified(true);
              }
            }
        }
      }catch(error){
        console.log(error)
        setErrorMessage("Format d'image invalide (JPEG ou PNG)")
      }
    };
    // get picture from camera
    const takePicture = async () => {
        setErrorMessage("")
        setMessage("")
        try{
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status === "granted") {
              const result = await ImagePicker.launchCameraAsync();
              if (result?.assets?.length) {
                  setPicture(result.assets[0].uri);
                  if (!isPictureModified) {
                      setIsPictureModified(true);
                  }
              }
          }
        }catch(error){
          console.log(error)
          setErrorMessage("Format d'image invalide (JPEG ou PNG)")
        }
    };

  return (
    <ScrollView>
      <View style={styles.container}>
        <InputCustom
          type="text"
          required={true}
          placeholder="E-mail"
          boolean={false}
          setFunction={setEmail}
        />
        <InputCustom
          type="text"
          required={true}
          placeholder="Nom d'utilisateur"
          boolean={false}
          setFunction={setUsername}
        />
        <InputCustom
          type="text"
          required={true}
          placeholder="Nom"
          boolean={false}
          setFunction={setLastname}
        />
        <InputCustom
          type="text"
          required={true}
          placeholder="Prénom"
          boolean={false}
          setFunction={setFirstname}
        />
        <InputCustom
          type="text"
          required={true}
          placeholder="Téléphone"
          boolean={false}
          setFunction={setPhone}
        />
        {/* avatar */}
        <View style={styles.topView}>
          <TouchableOpacity style={styles.pictureView}
           onPress={() => {uploadPicture()}}>
            {picture ? (
                <Image
                    source={{ uri: picture }}
                    style={styles.picture}
                    resizeMode="cover"
                />
            ) : (
              <FontAwesome
                name="user-circle"
                size={110}
                color={lightgray}
              />
            )}
          </TouchableOpacity>
          <View style={styles.icons}>
            <TouchableOpacity
              onPress={() => {uploadPicture()}}
            >
              <MaterialIcons
                name="photo-library"
                size={30}
                color={darkgray}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {takePicture()}}
            >
              <FontAwesome
                name="camera"
                size={25}
                color={darkgray}
              />
            </TouchableOpacity>
          </View>
        </View>

        <InputCustom
          type="password"
          required={true}
          placeholder="Mot de passe"
          secure={visibility}
          setSecure={setVisibility}
          setFunction={setPassword}
        />
        <InputCustom
          type="password"
          required={true}
          placeholder="Confirmation de mot de passe"
          secure={visibilityConfirm}
          setSecure={setVisibilityConfirm}
          setFunction={setConfirmPassword}
        />

        <Text style={[styles.message, errorMessage?styles.error:styles.success]}>
            {errorMessage ? errorMessage : message}
        </Text>

        <TouchableOpacity
          style={[styles.btn, styles.bg]}
          disabled={isLoading}
          onPress={()=>{submitSignUp()}}
        >
        <Text style={[styles.text, styles.bold]}>S'inscrire</Text>
        {isLoading && <ActivityIndicator color="#FFF" />}
        </TouchableOpacity>
      </View>
    </ScrollView>
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
        borderRadius: 5,
        marginTop:20,
        marginBottom: 30,
        width: "50%",
        justifyContent: "center",
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
});