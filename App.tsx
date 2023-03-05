import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import {
  Appbar,
  DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/Home";
import globalStyles from "./globalStyles";
import ChecklistDetails from "./components/ChecklistDetails";
import ChecklistUpdate from "./components/CheckListUpdate";
import ChecklistCreate from "./components/CheckListCreate";
import { Checklist } from "./models/ChecklistModel";

export type RootStackParamList = {
  ChecklistDetail: { checklist: Checklist };
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <View style={globalStyles.main}>
          <Image
            source={require("./assets/logo.png")}
            style={globalStyles.logo}
          />
        </View>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Dados da produção" component={ChecklistDetails} />
          <Stack.Screen
            name="Cadastrar checklist"
            component={ChecklistCreate}
          />
          <Stack.Screen
            name="Atualizar checklist"
            component={ChecklistUpdate}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
