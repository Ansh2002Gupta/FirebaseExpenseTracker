/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Dashboard from '../screens/Dashboard';
import History from '../screens/History';
import home from '../assests/images/icons/home.png';
import NativeProvider from '../context/NativeProvider';
import recent from '../assests/images/icons/time-past.png';

const BOTTOM = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <NativeProvider>
      <BOTTOM.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let icon;
            let styleShadow = focused ? styles.activeTabShadow : null;
            if (route.name === 'Dashboard') {
              icon = home;
            } else if (route.name === 'History') {
              icon = recent;
            }
            return (
              <View style={styleShadow}>
                <Image
                  source={icon}
                  style={[
                    {
                      width: focused ? size : size,
                      height: focused ? size : size,
                      tintColor: color,
                    },
                  ]}
                />
              </View>
            );
          },
          tabBarStyle: {
            backgroundColor: '#48de80',
            height: 65,
          },
          tabBarActiveBackgroundColor: '#FFFF',
          tabBarInactiveBackgroundColor: '#48de80',
          tabBarActiveTintColor: '#48de80',
          tabBarInactiveTintColor: '#FFFF',
          tabBarLabelStyle: {
            fontWeight: 'bold',
            fontSize: 16,
          },
        })}
        initialRouteName="Dashboard">
        <BOTTOM.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            headerShown: false,
          }}
        />
        <BOTTOM.Screen
          name="History"
          component={History}
          options={{headerShown: false}}
        />
      </BOTTOM.Navigator>
    </NativeProvider>
  );
};

const styles = StyleSheet.create({
  activeTabShadow: {
    shadowColor: '#48de80',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default BottomNavigator;
