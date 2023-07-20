import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SelectRange from './SelectRange';
import colors from "../assets/colors";
const { red } = colors;

const SearchBar = ({ 
  setSearchFilters, 
  filters, 
  setFilters, 
  priceValues, 
  surfaceValues
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [capacityMin, setCapacityMin] = useState('');
  const [date, setDate] = useState('');
   //slider filters for surface and price
  const [surfaceRangeValues, setSurfaceRangeValues] = useState(surfaceValues)
  const [priceRangeValues, setPriceRangeValues] = useState(priceValues)

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
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
            <TextInput
              style={styles.input}
              placeholder="Adresse"
              value={address}
              onChangeText={setAddress}
            />
            <TextInput
              style={styles.input}
              placeholder="Nombre de participants"
              value={capacityMin}
              onChangeText={setCapacityMin}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.lastInput]}
              placeholder="Date"
              value={date}
              onChangeText={setDate}
            />

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
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    paddingTop:50,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    fontFamily:"NotoSans",
    borderRadius:5
  },
  lastInput:{
    marginBottom:5,
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
    color: 'white',
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
});

export default SearchBar;
