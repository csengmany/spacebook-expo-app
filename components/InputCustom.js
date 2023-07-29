import React from "react";
import { TextInput, StyleSheet, View, Dimensions } from "react-native";
// import colors
import colors from "../assets/colors";
const { red, lightgray } = colors;

import { Ionicons } from "@expo/vector-icons";
const width = Dimensions.get("window").width;

const InputCustom = ({
    type,
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
                    name={secure ? "eye-outline" : "eye-off-outline"}
                    size={24}
                    color={lightgray}
                    onPress={() => {
                        setSecure(!secure);
                    }}
                    style={styles.eye}
                />
            )}
        </View>
    );
};

export default InputCustom;

const styles = StyleSheet.create({
    input: {
        fontSize: 18,
        borderBottomColor: red,
        borderBottomWidth: 1,
        borderRadius:5,
        padding:10,
        width: "80%",
        height: 50,
        marginTop: 30,
        position: "relative",
    },
    password:{
        paddingEnd:35,
    },
    horizontal: {
        flexDirection: "row",
        width: width,
        justifyContent: "center",
        alignItems: "center",
    },
    eye: {
        top: 43,
        right: 50,
        position: "absolute",
    },
});