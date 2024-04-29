import React, {
  useEffect,
  useContext,
  createContext,
  useRef,
  useState,
} from 'react';
import {View, Text, Pressable, ScrollView} from 'reac-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import Home from '../screens/Home';
import History from '../screens/History';
import Add from '../screens/Add';
import Dashboard from '../screens/Dashboard';

const BOTTOM = createBottomTabNavigator();

const MyTabs = ({navigation}) => {
  return (
    <BOTTOM.Navigator initialRouteName="Dashboard">
      <BOTTOM.Screen
        name="Dashboard"
        component={Dashboard}
        options={{headerShown: false}}
      />
      <BOTTOM.Screen
        name="History"
        component={History}
        options={{headerShown: false}}
      />
      <BOTTOM.Screen
        name="Add"
        component={Add}
        options={{headerShown: false}}
      />
    </BOTTOM.Navigator>
  );
};

export default MyTabs;
