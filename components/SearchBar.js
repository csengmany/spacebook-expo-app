import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SelectRange from './SelectRange';
import colors from "../assets/colors";
import { Calendar } from 'react-native-calendars';
const { red, lightgray } = colors;

const SearchBar = ({ 
  setSearchFilters, 
  filters, 
  setFilters, 
  priceValues, 
  surfaceValues,
  date,
  setDate
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [capacityMin, setCapacityMin] = useState('');
  const initialDate = date ? new Date(date) : new Date(); // Set initialDate to current date if date prop is not provided
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [dateValue, setDateValue] = useState(date ? new Date(date).toLocaleDateString('fr-FR') : '');

   //slider filters for surface and price
  const [surfaceRangeValues, setSurfaceRangeValues] = useState(surfaceValues)
  const [priceRangeValues, setPriceRangeValues] = useState(priceValues)
  const [showDatePicker, setShowDatePicker] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const handleNumberInputChange = (text) => {
    // remove all letters
    const numericValue = text.replace(/[^0-9]/g, '');
    setCapacityMin(numericValue);
  };

  const handleDateChange = (day) => {
    setShowDatePicker(false);
    if (day) {
      setSelectedDate(day);
      setDateValue(day.dateString); // Update the dateValue with the selected date
      setDate(day.dateString)
    }
  };

  const handleClearInput = (inputType) => {
    if (inputType === 'address') {
      setAddress('');
    } else if (inputType === 'capacityMin') {
      setCapacityMin('');
    } else if (inputType === 'date') {
      setSelectedDate(null);
      setDateValue(null);
      setDate(null)
    }
  };

  const handleSearch = () => {
    setSearchFilters(`date=${date?date:''}&capacityMin=${capacityMin?capacityMin:''}&address=${address?address:''}`)
    if(!filters.includes('surface'))
    setFilters(filters+`&surfaceMin=${surfaceRangeValues[0]}&surfaceMax=${surfaceRangeValues[1]}&priceMin=${priceRangeValues[0]}&priceMax=${priceRangeValues[1]}`)
    else{
      let newFilters = filters.replace(/surfaceMin=\d+/,`&surfaceMin=${surfaceRangeValues[0]}`)
      .replace(/surfaceMax=\d+/,`&surfaceMax=${surfaceRangeValues[1]}`)
      .replace(/priceMin=\d+/,`&priceMin=${priceRangeValues[0]}`)
      .replace(/priceMax=\d+/,`&priceMax=${priceRangeValues[1]}`)

      setFilters(newFilters)
    }
    closeModal();
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={openModal} style={styles.iconButton}>
        <Ionicons name="search-outline" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={openModal} style={styles.textButton}>
        <Text style={styles.text}>Adresse, participants...</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={openModal} style={styles.iconButton}>
        <Ionicons name="options-outline" size={24} color="black" />
      </TouchableOpacity>
      
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Adresse"
                value={address}
                onChangeText={setAddress}
                clearButtonMode="while-editing"
              />
              {address ? (
                <TouchableOpacity
                  style={styles.clearIcon}
                  onPress={() => handleClearInput('address')}
                >
                  <Ionicons name="close-circle" size={24} color={lightgray} />
                </TouchableOpacity>
              ) : null}
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nombre de participants"
                value={capacityMin}
                onChangeText={handleNumberInputChange}
                keyboardType="numeric"
                clearButtonMode="while-editing"
              />
              {capacityMin ? (
                <TouchableOpacity
                  style={styles.clearIcon}
                  onPress={() => handleClearInput('capacityMin')}
                >
                  <Ionicons name="close-circle" size={24} color={lightgray} />
                </TouchableOpacity>
              ) : null}
            </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={[styles.input, styles.dateInput]}
              onPress={() => setShowDatePicker(true)}
            >
            <TextInput
              editable={false} 
              style={{color:"black"}}
              placeholder="Sélectionner une date"
              value={dateValue?new Date (dateValue)?.toLocaleDateString("fr-FR"):''}
            />
            </TouchableOpacity>
             {date ? (
                <TouchableOpacity
                  style={styles.clearIcon}
                  onPress={() => handleClearInput('date')}
                >
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
                    // ...unavailableDates,
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

            <View style={styles.slider}>
              <View style={styles.labelContainer}>
                <Text style={styles.slideLabel}>Prix</Text>
                <SelectRange step={5} minRangeValue={priceValues[0]} maxRangeValue={priceValues[1]} fetchRangeValues={priceRangeValues} setFetchRangeValues={setPriceRangeValues} suffix="€" />
              </View>
            </View>
            <View style={styles.slider}>
              <View style={styles.labelContainer}>
                <Text style={styles.slideLabel}>Surface</Text>
                <SelectRange step={5} minRangeValue={surfaceValues[0]} maxRangeValue={surfaceValues[1]} fetchRangeValues={surfaceRangeValues} setFetchRangeValues={setSurfaceRangeValues} suffix="m²" />
              </View>
            </View>

            <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
              <Text style={styles.searchButtonText}>Rechercher</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    elevation: 2, // Shadow for Android
    shadowOffset: { width: 0, height: 1 }, // Shadow for iOS
    shadowOpacity: 0.5, // Shadow for iOS
    shadowRadius: 2,
    borderRadius:20
  },
  iconButton: {
    padding: 8,
  },
  textButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily:"NotoSans",
  },
  text: {
    fontSize: 16,
    fontFamily:"NotoSans",
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    paddingTop:50,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    fontFamily:"NotoSans",
    borderRadius:5,
    paddingRight:30
  },
  searchButton: {
    borderRadius:5,
    backgroundColor: red,
    padding: 16,
    alignItems: 'center',
    marginVertical: 16,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily:"NotoSans",
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },

   slider: {
      marginBottom: 16,
    },
    labelContainer: {
      alignItems: 'center',
      marginTop:16,
      marginBottom: 20,
    },
    slideLabel: {
      fontSize: 16,
      fontFamily:"NotoSans",
    },
    inputContainer:{
      position:"relative"
    },
    clearIcon:{
      position:"absolute",
      top:8,
      right:5,
    },
    dateInput:{
      display:"flex",
      justifyContent:"center",
      alignItems:"flex-start",
      marginBottom:5,
    }
});

export default SearchBar;
