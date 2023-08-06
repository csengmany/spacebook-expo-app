import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome,MaterialCommunityIcons } from "@expo/vector-icons";
import HomeScreen from "./containers/HomeScreen";
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";
import AccountScreen from "./containers/AccountScreen";
import { Image} from "react-native";
import colors from "./assets/colors";
const { red,darkgray } = colors;
import * as Font from 'expo-font';
import OfficeScreen from "./containers/OfficeScreen";
import BookingsScreen from "./containers/BookingsScreen";
import PaymentScreen from "./containers/PaymentScreen";
import ForgotPasswordScreen from "./containers/ForgotPasswordScreen";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userJson, setUserJson] = useState(null);

  const setUserStorage = async (userJson) => {
    if (userJson) {
      await AsyncStorage.setItem("userJson", userJson);
    } else {
      await AsyncStorage.removeItem("userJson");
    }
    setUserJson(userJson);
  };

  useEffect(() => {
    //load fonts
    const loadFonts = async () => {
      try{
          await Font.loadAsync({
            NotoSans: require('./assets/fonts/NotoSans-Regular.ttf'),
            NotoSansBold: require('./assets/fonts/NotoSans-Bold.ttf'),
            NotoSansMedium: require('./assets/fonts/NotoSans-Medium.ttf'),
          })
        setIsLoading(false)
      }catch(error) {
        console.error('Error loading fonts:', error)
      }
    }
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      // We should also handle error for production apps
      const userJson = await AsyncStorage.getItem("userJson");

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setUserJson(userJson)
    };
    bootstrapAsync()
    loadFonts()
  }, []);

  if (isLoading === true) {
    // We haven't finished checking for the token yet
    return null;
  }

  return ( isLoading? <ActivityIndicator /> :  
      <NavigationContainer>
        <Stack.Navigator>
          {userJson === null ? (
            // No token found, user isn't signed in
            <>
              <Stack.Screen name="SignIn"
              options={{
                title: "Connexion",
              }}>
                {() => <SignInScreen setUserStorage={setUserStorage} />}
              </Stack.Screen>
              <Stack.Screen name="SignUp"
               options={{
                title: "Inscription",
              }}>
                {() => <SignUpScreen />}
              </Stack.Screen>
              <Stack.Screen name="ForgotPassword"
              options={{
                title: "Mot de passe oublié",
              }}>
                {() => <ForgotPasswordScreen />}
              </Stack.Screen>
            </>
          ) : (
            <>
            <Stack.Screen name="Tab" options={{ headerShown: false }}>
              {() => (
                <Tab.Navigator
                  screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: red,
                    tabBarInactiveTintColor: darkgray,
                  }}
                >
                  <Tab.Screen
                    name="TabHome"
                    options={{
                      tabBarLabel: "Explorer",
                      tabBarIcon: ({ color, size }) => (
                        <Ionicons name={"search"} size={size} color={color} />
                      ),
                    }}
                  >
                    {() => (
                      <Stack.Navigator>
                        <Stack.Screen
                          name="Home"
                          options={{
                            title: "SPACEBOOK",
                            headerStyle: { backgroundColor: red },
                            headerTitleStyle: { color: "#FFF", fontFamily:'NotoSansBold' },
                          }}
                        >
                          {() => <HomeScreen />}
                        </Stack.Screen>
                      </Stack.Navigator>
                    )}
                  </Tab.Screen>
                  <Tab.Screen
                    name="TabBookings"
                    options={{
                      tabBarLabel: "Mes réservations",
                      tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="history" size={size} color={color} />
                      ),
                    }}
                  >
                    {() => (
                      <Stack.Navigator>
                        <Stack.Screen
                          name="Bookings"
                          options={{
                            title: "Mes réservations",
                          }}
                        >
                          {() => <BookingsScreen userJson={userJson}/>}
                        </Stack.Screen>
                      </Stack.Navigator>
                    )}
                  </Tab.Screen>
                  <Tab.Screen
                    name="TabAccount"
                    options={{
                      tabBarLabel: "Profil",
                      tabBarIcon: ({ color, size }) => (
                        JSON.parse(userJson).avatar?
                        <Image 
                          style={{height:28,width:28, borderRadius:50}}
                          source={{
                              uri: JSON.parse(userJson).avatar,
                          }}
                        />
                        :
                        <FontAwesome name="user-circle" size={size} color={color} />
                      ),
                    }}
                  >
                    {() => (
                      <Stack.Navigator>
                        <Stack.Screen
                          name="Account"
                          options={{
                            title: "Profil",
                          }}
                        >
                          {() => <AccountScreen setUserStorage={setUserStorage} userJson={userJson}/>}
                        </Stack.Screen>
                      </Stack.Navigator>
                    )}
                  </Tab.Screen>
                </Tab.Navigator>
              )}
            </Stack.Screen>
            <Stack.Screen
                name="Office"
                options={{
                  title: "Détails",
                }}
              >
              {() => <OfficeScreen />}
            </Stack.Screen>
            
            <Stack.Screen
                name="Payment"
                options={{
                  title: "Réservation",
                }}
              >
              {() => <PaymentScreen  userJson={userJson}/>}
            </Stack.Screen>

            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
  );
}