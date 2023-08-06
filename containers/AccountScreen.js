import { ActivityIndicator, Text, View,Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import InputCustom from "../components/InputCustom";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import validator from "validator";
import colors from "../assets/colors";
const { red, green, lightgray, darkgray} = colors;

export default function AccountScreen({ userJson, setUserStorage }) {
  const server = "http://192.168.1.37:3002"
  //"https://spacebook-backend-94816fa1b759.herokuapp.com"

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false)
  const [visibilityConfirm, setVisibilityConfirm] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialVal, setInitialVal] = useState({})
  
  const [isUpdateLoading, setIsUpdateLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const [editPassword, setEditPassword] = useState(false)

  const [picture, setPicture] = useState(null);
  const [isPictureModified, setIsPictureModified] = useState(false);

  useEffect(()=>{
    //axios request
    const fetchData = async () => {
      try {
          setIsLoading(true)
          const response = await axios.get(`${server}/user/${JSON.parse(userJson).id}`,
          {headers: {Authorization: "Bearer " + JSON.parse(userJson).token, "Content-Type": "application/json"}})
          if(response){
              const user = response.data.user
              setIsLoading(false)
              setInitialVal(user)
              setEmail(user.email)
              setUsername(user.account.username)
              setLastname(user.account.lastname)
              setFirstname(user.account.firstname)
              setPhone(user.account.phone)
          }
      } catch (error) {
          console.log(error)
      }
    }
    fetchData()
  },[userJson])

  const handleSubmit = async () => {
    setErrorMessage("")
    setMessage("")
      try {
          const formData = new FormData()
          formData.append("id", JSON.parse(userJson).id)
          clearMessageAfterDelay()
          if(editPassword && password && newPassword && newPassword===confirmPassword){
              const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>.])[A-Za-z\d!@#$%^&*()\-_=+{};:,<.>.]{8,}$/
              if(!passwordRegex.test(newPassword)){
                  return setErrorMessage("Format du nouveau mot de passe invalide : 8 caractères minimum dont 1 minuscule, 1 majuscule, 1 chiffre et 1 symbole")}
              formData.append("password", password)
              formData.append("newPassword", newPassword)
          }else if(editPassword && newPassword!==confirmPassword){
              return setErrorMessage("Les mots de passes renseignés ne sont pas identiques")}
          else if(editPassword && (!password || !newPassword)){
            return setErrorMessage("Complétez tous les champs de mot de passe")
          }
            
          if(email && email!==initialVal.email)
              formData.append("email", email)
          if(username && username!==initialVal.account.username)
              formData.append("username", username)
          if(lastname && lastname!==initialVal.account.lastname)
              formData.append("lastname", lastname)
          if(firstname && firstname!==initialVal.account.firstname)
              formData.append("firstname", firstname)
          if(phone && phone!==initialVal.account.phone)
              formData.append("phone", phone)
          if(picture && !isDisabled){
              const uri = picture;
              const uriParts = uri.split(".");
              const fileType = uriParts[1];

              formData.append("avatar", {
                uri,
                name: `userAvatar`,
                type: `image/${fileType}`,
              });
              console.log(picture)
            }
          setIsUpdateLoading(true)
          const response = await axios.put(
              `${server}/user/update`,formData,
              {headers: {
                  Authorization: "Bearer " + JSON.parse(userJson).token,
                  "Content-Type": "multipart/form-data",
              }}
          )
          if (response.data.user.token) {
            console.log(response.data.user.token)
              setUserStorage(JSON.stringify({
                      token: response.data.user.token,
                      id:response.data.user._id, 
                      email:response.data.user.email, 
                      username:response.data.user.account.username, 
                      lastname: response.data.user.account.lastname,
                      avatar:response.data.user.account?.avatar? response.data.user.account?.avatar?.secure_url:""
                  }))
              setMessage("Modification(s) enregistrée(s)")
              clearMessageAfterDelay()
          }
        setIsUpdateLoading(false)
      } catch (error) {
        console.log(error.response)
        setIsUpdateLoading(false)
          if (error.response.data) {
            if(error.response.data.error==="Missing information to update")
              setErrorMessage("Il n'y a pas de modification")
            else if(error.response.data.error==="This email is already used.")
              setErrorMessage("Cette email est déjà utilisé")
            else if(error.response.data.error==="This username is already used.")
              setErrorMessage("Ce nom d'utilisateur est déjà utilisé")
            else
              setErrorMessage(error.response.data.error)
          }
        clearMessageAfterDelay()
      }
  }
  const clearMessageAfterDelay = () => {
    setTimeout(() => {
          setMessage("")
          setErrorMessage("")
        }, 4000);
  }
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
              setIsDisabled(false)
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
                  setIsDisabled(false)
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
        <TouchableOpacity
          style={[styles.btn, styles.bg]}
          onPress={() => {
            setUserStorage(null)
          }}
        >
          <Text style={[styles.text, styles.bold]}>Déconnexion</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mes informations personnelles</Text>

        <TouchableOpacity   onPress={() => {
            setIsDisabled(!isDisabled)
          }}>
          <Text style={styles.link}>{isDisabled?"Modifier":"Annuler les modifications"}</Text> 
        </TouchableOpacity>

        {!isLoading && <View style={styles.container}>
        <InputCustom
          type="text"
          required={true}
          placeholder="E-mail"
          boolean={false}
          setFunction={setEmail}
          value={isDisabled?initialVal.email:email}
          editable={isDisabled}
        />
        <InputCustom
          type="text"
          required={true}
          placeholder="Nom d'utilisateur"
          boolean={false}
          setFunction={setUsername}
          value={isDisabled?initialVal?.account?.username:username}
          editable={isDisabled}
        />
        <InputCustom
          type="text"
          required={true}
          placeholder="Nom"
          boolean={false}
          setFunction={setLastname}
          value={isDisabled?initialVal?.account?.lastname:lastname}
          editable={isDisabled}
        />
        <InputCustom
          type="text"
          required={true}
          placeholder="Prénom"
          boolean={false}
          setFunction={setFirstname}
          value={isDisabled?initialVal?.account?.firstname:firstname}
          editable={isDisabled}
        />
        <InputCustom
          type="text"
          required={true}
          placeholder="Téléphone"
          boolean={false}
          setFunction={setPhone}
          value={isDisabled?initialVal?.account?.phone:phone}
          editable={isDisabled}
        />
        {/* avatar */}
        <View style={styles.topView}>
          <TouchableOpacity style={styles.pictureView}
           onPress={() => {uploadPicture()}}>
            {(!isDisabled && picture) || initialVal?.account?.avatar ? (
                <Image
                    source={{ uri: !isDisabled ?picture:initialVal.account.avatar.secure_url }}
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
      <TouchableOpacity   onPress={() => {
            setEditPassword(!editPassword)
          }}>
          <Text style={[styles.link, styles.marginTop]}>{editPassword?"Annuler l'édition du mot de passe":"Modifier mon mot de passe"}</Text> 
        </TouchableOpacity>
        { editPassword && <View>
          <InputCustom
            type="password"
            required={true}
            placeholder="Ancien mot de passe"
            secure={visibility}
            setSecure={setVisibility}
            setFunction={setPassword}
          />
          <InputCustom
            type="password"
            required={true}
            placeholder="Mot de passe"
            secure={newPasswordVisible}
            setSecure={setNewPasswordVisible}
            setFunction={setNewPassword}
          />
          <InputCustom
            type="password"
            required={true}
            placeholder="Confirmation de mot de passe"
            secure={visibilityConfirm}
            setSecure={setVisibilityConfirm}
            setFunction={setConfirmPassword}
          />
        </View>}
        <Text style={[styles.message, errorMessage?styles.error:styles.success]}>
            {errorMessage ? errorMessage : message}
        </Text>

        <TouchableOpacity
          style={[styles.btn, styles.bg, (isDisabled && !editPassword && styles.disabled)]}
          disabled={isUpdateLoading || (isDisabled && !editPassword)}
          onPress={()=>{handleSubmit()}}
        >
        <Text style={[styles.text, styles.bold]}>Enregistrer {isUpdateLoading && <ActivityIndicator color="#FFF" />}</Text>
        </TouchableOpacity>
       </View>}
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