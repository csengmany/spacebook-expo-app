import React from "react";
import { TextInput, StyleSheet, View, Dimensions, Text } from "react-native";
// import colors
import colors from "../assets/colors";
const { lightgray } = colors;

import { Ionicons } from "@expo/vector-icons";
const width = Dimensions.get("window").width;

const InputCustom = ({
    type,
    required,
    placeholder,
    setFunction,
    secure,
    setSecure,
    value,
    setNewInformations,
    setDisplayMessage,
    setIsInfosModified,
}) => {
    return (
        <View style={styles.container}>
        <Text style={styles.label}>{placeholder}{required && "*"}</Text>
            <View style={styles.horizontal}>
                <TextInput
                    style={[styles.input, type==="password"?styles.password:styles.text]}
                    placeholder={placeholder}
                    autoCapitalize="none"
                    onChangeText={(text) => {
                        setFunction(text);
                        if (setNewInformations) {
                            setNewInformations(true);
                        }
                        if (setDisplayMessage) {
                            setDisplayMessage(false);
                        }
                        if (setIsInfosModified) {
                            setIsInfosModified(true);
                        }
                    }}
                    secureTextEntry={secure}
                    value={value && value}
                />
                {type === "password" && (
                    <Ionicons
                        name={secure ? "eye" : "eye-off"}
                        size={24}
                        color={lightgray}
                        onPress={() => {
                            setSecure(!secure);
                        }}
                        style={styles.eye}
                    />
                )}
            </View>
        </View>
    );
};

export default InputCustom;

const styles = StyleSheet.create({
    label:{
        fontFamily:"NotoSans",
        marginTop: 20,
        marginBottom:5,
        marginStart:40
    },
    input: {
        fontSize: 18,
        borderColor: lightgray,
        borderWidth: 1,
        borderRadius:5,
        padding:10,
        width: "80%",
        height: 50,
        position: "relative",
        fontFamily:"NotoSans"
    },
    password:{
        paddingEnd:35,
    },
    container:{
        
    },
    horizontal: {
        flexDirection: "row",
        width: width,
        justifyContent: "center",
        alignItems: "center",
    },
    eye: {
        top: 13,
        right: 50,
        position: "absolute",
    },
});