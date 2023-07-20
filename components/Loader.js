import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";

const Loader = () => {
   return (
      <View style={styles.container}>
         <ActivityIndicator />
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "green",
   },
});
export default Loader;