import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import colors from '../assets/colors';
import { useNavigation } from '@react-navigation/native';
const { red, lightgray, darkgray } = colors;

// Configure the calendar to use the French locale
LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = 'fr';

const OfficePrice = ({ office, date, setDate }) => {
  const navigation = useNavigation();
  const initialDate = date ? new Date(date) : new Date(); // Set initialDate to current date if date prop is not provided
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [dateValue, setDateValue] = useState(date ? date: '');
  // Convert dates in the office.unavailable_dates array to the correct format
  const formattedUnavailableDates = office.unavailable_dates.reduce((acc, date) => {
  const formattedDate = new Date(date).toISOString().split('T')[0];
  acc[formattedDate] = { disabled: true, disableTouchEvent: true, color: 'gray' };
  return acc;
}, {});

  const unavailableDates = {
    ...formattedUnavailableDates
  };
  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleDateChange = (day) => {
    setShowDatePicker(false);
    if (day) {
      setSelectedDate(day);
      setDateValue(day.dateString); // Update the dateValue with the selected date
      setDate(day.dateString)
    }
  };

    const handleClearInput = () => {
    setSelectedDate(null);
    setDateValue(null);
  };

  const handleReserve = () => {
    if (selectedDate) {
      // Proceed to the booking step
      navigation.navigate('Payment', { office: office });
    }
  };
  return (


    <View style={showDatePicker ? styles.xlContainer : styles.priceContainer}>
      <View>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Text style={styles.bold}>{office.price} € </Text>
          <Text style={styles.price}> par jour</Text>
        </View>
        <View style={!showDatePicker&&styles.inputContainer}>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.input, styles.dateInput]} onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={{ color: 'black' }}
                editable={false}
                placeholder="Ajouter une date"
                value={dateValue?(typeof dateValue==="string"?(new Date(dateValue).toLocaleDateString('fr-FR')):dateValue):''}
              />
            </TouchableOpacity>
            {showDatePicker && 
              <TouchableOpacity 
                style={[styles.btn, styles.smallBtn, styles.bg]}
                onPress={()=>{setShowDatePicker(false)}} 
              >
                <Text style={[styles.text]}>OK</Text>
              </TouchableOpacity>}
          </View>
          {dateValue && !showDatePicker ? (
            <TouchableOpacity style={styles.clearIcon} onPress={handleClearInput}>
              <Ionicons name="close-circle" size={24} color={lightgray} />
            </TouchableOpacity>
          ) : null}
        </View>
        {showDatePicker && (
          <Calendar
          style={{
            marginBottom:15
          }}
            current={selectedDate ? selectedDate.dateString : new Date().toISOString().split('T')[0]}
            minDate={new Date().toISOString().split('T')[0]}
            maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]}
            onDayPress={handleDateChange}
            markedDates={{
              ...unavailableDates,
              ...(selectedDate ? { [selectedDate.dateString]: { selected: true, disableTouchEvent: true } } : {})
            }}
            disableAllTouchEventsForDisabledDays
            theme={{
            arrowColor: 'black',
            borderRadius:8,
            textMonthFontFamily: 'NotoSansBold',
            textDayFontFamily: 'NotoSans',
            textMonthFontSize: 16,
            textDayFontSize: 15,
            todayTextColor: red,
            selectedDayTextColor: 'white',
            selectedDayBackgroundColor: red,
            dayTextColor: 'black',
            textDisabledColor: lightgray,
            'stylesheet.day.basic': {
              text: {
                fontSize: 15,
                fontFamily: 'NotoSans',
                color: 'black',
              },
              today: {
                borderColor: red,
                borderWidth: 1,
                borderRadius: 5,
              },
              selected: {
                backgroundColor: red,
                borderRadius: 5,
              },
              disabled: {
                backgroundColor: 'transparent',
              },
            },
          }}
          />
        )}
      </View>

      {!showDatePicker && (
        <TouchableOpacity
          style={[styles.btn, dateValue ? styles.bg : styles.disabled]}
          onPress={handleReserve}
          disabled={!date}
        >
          <Text style={[styles.text]}>Réserver</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default OfficePrice;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceContainer: {
    paddingVertical: 10,
  },
  price: {
    fontFamily: 'NotoSans',
    fontSize: 18,
  },
  btn: {
    height: 50,
    borderStyle: 'solid',
    borderWidth: 3,
    borderRadius: 5,
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  bg: {
    borderColor: red,
    backgroundColor: red,
  },
  disabled: {
    borderColor: darkgray,
    backgroundColor: darkgray,
  },
  text: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'NotoSansBold',
  },
  dateInput:{
    borderColor:red,
    borderWidth:1,
    padding:10,
    borderRadius:5, 
    width:200
  },
   row:{
      display:"flex",
      flexDirection:"row",
      justifyContent:"space-between",
      alignItems:"center"
    },
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
        height: 40,
        borderStyle: "solid",
        borderWidth: 3,
        borderRadius: 5,
        width: 130,
        justifyContent: "center",
        alignItems: "center",
        marginLeft:50,
        marginVertical: 15
    },
    smallBtn:{
      height:40,
      width:80,
    },
     bg: {
        borderColor: red,
        backgroundColor: red,
    },
    disabled:{
      borderColor: darkgray,
      backgroundColor: darkgray,
    },
     text: {
        fontSize:18,
        color: "#FFF",
        textAlign: "center",
        fontFamily:"NotoSansBold"
    },
});
