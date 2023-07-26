import { useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import { Image, Text, TextInput, View, StyleSheet, useWindowDimensions, ScrollView, TouchableOpacity, Platform } from "react-native";
import axios from "axios"
import React, { useEffect, useState }  from "react"
import Loader from "../components/Loader";
import MapView, { Marker } from "react-native-maps";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import { FontAwesome, Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
// import colors
import colors from "../assets/colors";
const { black, red, lightgray } = colors;

const OfficePrice = ({office, date, id }) => {
    const navigation = useNavigation();

    const [selectedDate, setSelectedDate] = useState(date?date: new Date())
    const [dateValue, setDateValue] = useState (date? date.toLocaleDateString("fr-FR") :'')
    
    const [showDatePicker, setShowDatePicker] = useState(false);
    const handleDateChange = (event, selected) => {
        setShowDatePicker(false);
        if (selected) {
        setSelectedDate(selected);
        setDateValue(selected.toLocaleDateString("fr-FR"))
        }
    };
    const handleClearInput = (inputType) => {
        setDateValue('');
    };
    
    return (      
    <View style={showDatePicker?styles.xlContainer:styles.priceContainer}>
        <View> 
            <View style={{display:"flex", flexDirection:"row"}}>
                <Text style={styles.bold}>{office.price} € </Text>
                <Text style={styles.price}> par jour</Text> 
            </View>
            <View style={styles.inputContainer}>
                <TouchableOpacity
                style={[styles.input, styles.dateInput]}
                onPress={() => setShowDatePicker(true)}
                >
                <TextInput style={{color:"black"}}
                editable={false} 
                placeholder="Ajouter une date"
                value={dateValue}
                />
                </TouchableOpacity>
                {dateValue  &&!showDatePicker? (
                    <TouchableOpacity
                    style={styles.clearIcon}
                    onPress={() => handleClearInput('date')}
                    >
                    <Ionicons name="close-circle" size={24} color={lightgray} />
                    </TouchableOpacity>
                ) : null}
            </View>
            {showDatePicker && (
            <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                minimumDate={new Date()} // Disable past dates
                maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))} //Disables dates greater than 1 year from the current date 
            />
            )}
        </View>

        {!showDatePicker&&<TouchableOpacity
          style={[styles.btn, styles.bg]}
          onPress={() => {
            navigation.navigate("Payment", { id: office._id, date:Date.parse(selectedDate) })
          }}
        >
          <Text style={[styles.text]}>Réserver</Text>
        </TouchableOpacity>}
      </View>)
};

export default OfficePrice;
const styles = StyleSheet.create({
    bold:{
        fontFamily:"NotoSansBold",
        fontSize:18,
    },
    price:{
        fontFamily:"NotoSans",
        fontSize:18,
    },
    priceContainer:{
      display:"flex",
      flexDirection:"row",
      justifyContent:"center",
      alignItems:"flex-end",
      paddingHorizontal:25,
      paddingTop:10,
      borderTopWidth: 1, 
      borderTopColor:lightgray,
    },
     xlContainer:{
      borderTopWidth: 1, 
      borderTopColor:lightgray,
      paddingHorizontal:25,
      paddingTop:15,
    },
    inputContainer:{
      position:"relative",
      marginVertical: 15
    },
    clearIcon:{
      position:"absolute",
      top:8,
      right:5,
    },
    input: {
      height: 40,
      width:150,
      borderColor: lightgray,
      borderWidth: 1,
      paddingLeft: 8,
      fontFamily:"NotoSans",
      borderRadius:5,
      paddingRight:30
  },
    dateInput:{
      display:"flex",
      justifyContent:"center",
      alignItems:"flex-start",
    },
    btn: {
        height: 50,
        borderStyle: "solid",
        borderWidth: 3,
        borderColor: red,
        borderRadius: 5,
        width: 130,
        justifyContent: "center",
        alignItems: "center",
        marginLeft:50,
        marginVertical: 15
    },
     bg: {
        backgroundColor: red,
    },
     text: {
        fontSize:18,
        color: "#FFF",
        textAlign: "center",
        fontFamily:"NotoSansBold"
    },
});