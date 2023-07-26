import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../assets/colors";
const { red } = colors;
export default function AccountScreen({ setToken }) {
  return (
    <View style={styles.container}>
      <Text>Hello Settings</Text>

        <TouchableOpacity
          style={[styles.btn, styles.bg]}
          onPress={() => {
            setToken(null)
          }}
        >
          <Text style={[styles.text]}>Se déconnecter</Text>
        </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    text: {
        color: "#FFF",
        textAlign: "center",
        fontFamily:"NotoSansBold"
    },
    btn: {
        height: 50,
        borderStyle: "solid",
        borderWidth: 3,
        borderColor: red,
        borderRadius: 5,
        marginVertical: 10,
        width: "50%",
        justifyContent: "center",
        alignItems: "center",
    },
    bg: {
        backgroundColor: red,
    },
});