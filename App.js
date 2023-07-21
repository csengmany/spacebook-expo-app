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
import SplashScreen from "./containers/SplashScreen";
import colors from "./assets/colors";
const { red,darkgray } = colors;
import * as Font from 'expo-font';
import OfficeScreen from "./containers/OfficeScreen";
import BookingsScreen from "./containers/BookingsScreen";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const setToken = async (token) => {
    if (token) {
      await AsyncStorage.setItem("userToken", token);
    } else {
      await AsyncStorage.removeItem("userToken");
    }
    setUserToken(token);
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
      const userToken = await AsyncStorage.getItem("userToken");

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setUserToken(userToken)
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
          {userToken === null ? (
            // No token found, user isn't signed in
            <>
              <Stack.Screen name="SignIn">
                {() => <SignInScreen setToken={setToken} />}
              </Stack.Screen>
              <Stack.Screen name="SignUp">
                {() => <SignUpScreen setToken={setToken} />}
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
                            headerTitleStyle: { color: "white", fontFamily:'NotoSansBold' },
                          }}
                        >
                          {() => <HomeScreen />}
                        </Stack.Screen>

                        <Stack.Screen
                          name="Bookings"
                          options={{
                            title: "Mes réservations",
                          }}
                        >
                          {() => <BookingsScreen />}
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
                            title: "Mes réservation",
                          }}
                        >
                          {() => <BookingsScreen/>}
                        </Stack.Screen>
                      </Stack.Navigator>
                    )}
                  </Tab.Screen>
                  <Tab.Screen
                    name="TabAccount"
                    options={{
                      tabBarLabel: "Mon compte",
                      tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="user-circle" size={size} color={color} />
                      ),
                    }}
                  >
                    {() => (
                      <Stack.Navigator>
                        <Stack.Screen
                          name="Account"
                          options={{
                            title: "Mon compte",
                          }}
                        >
                          {() => <AccountScreen setToken={setToken} />}
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
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
  );
}