import { useRoute } from "@react-navigation/core";
import { Text, View } from "react-native";

export default function OfficeScreen() {
  const { params } = useRoute();
  return (
    <View>
      <Text>user id :{params.officeId} </Text>
    </View>
  );
}
