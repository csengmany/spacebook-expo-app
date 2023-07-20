import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from "react-native";
import {Feather, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import colors from "../assets/colors";
const { red, darkgray } = colors;
const Filters = ({setPage, setFilters, searchFilters, priceValues, surfaceValues}) => {
    //filters for equipments and services
    const[tv, setTv] = useState(false)
    const[whiteboard, setWhiteboard] = useState(false)
    const[projector, setProjector] = useState(false)
    const[coffee, setCoffee] = useState(false)
    const[water, setWater] = useState(false)
    const[ac, setAc] = useState(false)
    const[elevator, setElevator] = useState(false)
    const[sort, setSort] = useState('')
    //slider filters for surface and price
    const [surfaceRangeValues, setSurfaceRangeValues] = useState(surfaceValues)
    const [priceRangeValues, setPriceRangeValues] = useState(priceValues)
    const resetFilters = () => {
        setTv(false)
        setWhiteboard(false)
        setProjector(false)
        setCoffee(false)
        setWater(false)
        setAc(false)
        setElevator(false)
        setSurfaceRangeValues(surfaceValues)
        setPriceRangeValues(priceValues)

    }
    useEffect(()=>{
        setPage(1)
        //action when set filters
        setFilters(`${tv?"&tv="+tv:''}${whiteboard?"&whiteboard="+whiteboard:''}${projector?"&projector="+projector:''}
        ${coffee?"&coffee="+coffee:''}${water?"&water="+water:''}${ac?"&ac="+ac:''}${elevator?"&elevator="+elevator:''}${ac?"&ac="+ac:''}&sort=${sort}`)
    },[ 
        setFilters,
        setPage,
        //filters dependencies
        searchFilters,
        tv, whiteboard, projector, 
        coffee, water,ac, elevator,
        surfaceRangeValues,priceRangeValues,
        sort
    ])
   return (
        <View>
          <ScrollView horizontal={true}>
            <TouchableOpacity style={styles.btnFilter} onPress={()=>setTv(!tv)}>
              <FontAwesome name="tv" size={24} color={tv?red:darkgray} />
              <Text style={{color:tv?red:darkgray}}>Écran TV</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFilter} onPress={()=>setWhiteboard(!whiteboard)}>
              <MaterialCommunityIcons name="presentation" size={24} color={whiteboard?red:darkgray} />
              <Text style={{color:whiteboard?red:darkgray}}>Tableau blanc</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFilter} onPress={()=>setProjector(!projector)}>
              <Ionicons name="videocam-outline" size={24} color={projector?red:darkgray} />
              <Text style={{color:projector?red:darkgray}}>Vidéo-projecteur</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFilter} onPress={()=>setCoffee(!coffee)}>
              <MaterialCommunityIcons name="coffee-maker-outline" size={24} color={coffee?red:darkgray} />
              <Text style={{color:coffee?red:darkgray}}>Thé & café</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFilter} onPress={()=>setWater(!water)}>
              <Ionicons name="water-outline" size={24} color={water?red:darkgray} />
              <Text style={{color:water?red:darkgray}}>Fontaine à eau</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFilter} onPress={()=>setAc(!ac)}>
              <FontAwesome name="snowflake-o" size={24} color={ac?red:darkgray} />
              <Text style={{color:ac?red:darkgray}}>Climatiseur</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFilter} onPress={()=>setElevator(!elevator)}>
              <MaterialCommunityIcons name="elevator-passenger-outline" size={24} color={elevator?red:darkgray} />
              <Text style={{color:elevator?red:darkgray}}>Ascenseur</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFilter}>
              <Feather name="refresh-cw" size={24} color="black" />
              <Text>Réinitialiser</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
   );
};

const styles = StyleSheet.create({
    btnFilter:{
      flex:1,
      justifyContent:"center",
      alignItems:"center",
      marginHorizontal:5,
      marginTop: 5,
    },
    slider: {
      marginBottom: 16,
    },
    labelContainer: {
      // // flexDirection: 'row',
      alignItems: 'center',
      marginTop:10,
      marginBottom: 20,
    },
    slideLabel: {
      marginRight: 8,
      fontSize: 16,
      fontWeight: 'bold',
    },
});
export default Filters;