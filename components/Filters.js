import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from "react-native";
import {Feather, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from "../assets/colors";
const { red, lightgray } = colors;
const Filters = ({
  setPage, 
  setFilters, 
  searchFilters, 
}) => {
    //filters for equipments and services
    const[tv, setTv] = useState(false)
    const[whiteboard, setWhiteboard] = useState(false)
    const[projector, setProjector] = useState(false)
    const[coffee, setCoffee] = useState(false)
    const[water, setWater] = useState(false)
    const[ac, setAc] = useState(false)
    const[elevator, setElevator] = useState(false)
    const[sort] = useState('')

    const resetFilters = () => {
        setTv(false)
        setWhiteboard(false)
        setProjector(false)
        setCoffee(false)
        setWater(false)
        setAc(false)
        setElevator(false)
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
        sort
    ])
   return (
        <View style={styles.border}>
          <ScrollView horizontal={true}>
            <TouchableOpacity style={styles.btnFilter} onPress={()=>setTv(!tv)}>
              <FontAwesome name="tv" size={24} color={tv?red:"black"} />
              <Text style={{color:tv?red:"black"}}>Écran TV</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFilter} onPress={()=>setWhiteboard(!whiteboard)}>
              <MaterialCommunityIcons name="presentation" size={24} color={whiteboard?red:"black"} />
              <Text style={{color:whiteboard?red:"black"}}>Tableau blanc</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFilter} onPress={()=>setProjector(!projector)}>
              <Ionicons name="videocam-outline" size={24} color={projector?red:"black"} />
              <Text style={{color:projector?red:"black"}}>Vidéo-projecteur</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFilter} onPress={()=>setCoffee(!coffee)}>
              <MaterialCommunityIcons name="coffee-maker-outline" size={24} color={coffee?red:"black"} />
              <Text style={{color:coffee?red:"black"}}>Thé & café</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFilter} onPress={()=>setWater(!water)}>
              <Ionicons name="water-outline" size={24} color={water?red:"black"} />
              <Text style={{color:water?red:"black"}}>Fontaine à eau</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFilter} onPress={()=>setAc(!ac)}>
              <FontAwesome name="snowflake-o" size={24} color={ac?red:"black"} />
              <Text style={{color:ac?red:"black"}}>Climatiseur</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFilter} onPress={()=>setElevator(!elevator)}>
              <MaterialCommunityIcons name="elevator-passenger-outline" size={24} color={elevator?red:"black"} />
              <Text style={{color:elevator?red:"black"}}>Ascenseur</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFilter} onPress={resetFilters}>
              <Feather name="refresh-cw" size={24} color="black" />
              <Text>Réinitialiser</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
   );
};

const styles = StyleSheet.create({
    btnFilter:{
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      margin: 10,
    },
    border:{
      borderColor: lightgray,
      borderBottomWidth:1,
    }
});
export default Filters;