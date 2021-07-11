import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator'
import CustomSidebarMenu  from './customSidebarMenu';
import MyBartersScreen from '../screens/MyBartersScreen';
import SettingScreen from '../screens/SettingScreen';
import MyRecievedItemScreen from '../screens/MyRecievedBookScreen';
import NotificationScreen from '../screens/NotificationsScreen';

export const AppDrawerNavigator = createDrawerNavigator({
  Home : {
    screen : AppTabNavigator
    },
  MyBarters:{
      screen : MyBartersScreen,
    },
  Notifications :{
    screen : NotificationScreen
  },
  MyRecievedItemScreen:{
    screen: MyRecievedItemScreen
  },
    Setting : {
      screen : SettingScreen
    }
},
  {
    contentComponent:CustomSidebarMenu
  },
  {
    initialRouteName : 'Home'
  })