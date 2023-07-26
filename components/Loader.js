import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import colors from "../assets/colors";
const { red } = colors;

const Loader = () => {
   return (
      <View style={styles.container}>
         <ActivityIndicator color={red}/>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FFF",
   },
});
export default Loader;