import { useRoute } from "@react-navigation/core";
import { Text, View } from "react-native";

export default function BookingsScreen() {
  const { params } = useRoute();
  return (
    <View>
      <Text> liste des reservations</Text>
    </View>
  );
}
