import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import SignUpScreen from './screens/SignUpScreeen';
import { AppTabNavigator } from './components/AppTabNavigator'
import {AppDrawerNavigator} from './components/AppDrawerNavigator';

export default function App() {
  return (
    <SignUpScreen/>
  );
}

const switchNavigator = createSwitchNavigator({
  WelcomeScreen:{screen: WelcomeScreen},
  Drawer:{screen: AppDrawerNavigator},
  BottomTab: {screen:AppTabNavigator}
})

const AppContainer =  createAppContainer(switchNavigator);
