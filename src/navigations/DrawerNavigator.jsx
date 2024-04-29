import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import GoogleSignInScreen from '../screens/GoogleSignInScreen';
import LandingPage from '../screens/LadingPage';
import UserInfoDisplay from '../components/UserInfoDisplay';

const DRAWER = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <DRAWER.Navigator
      drawerIcon={{color: '#FFFF'}}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#48de80',
        },
        headerTintColor: '#FFFF',
        headerTitleStyle: {
          color: 'white',
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
        drawerActiveBackgroundColor: '#48de80',
        drawerActiveTintColor: '#FFFF',
        drawerInactiveTintColor: '#48de80',
      }}
      drawerContent={() => <UserInfoDisplay />}
      initialRouteName="LandingPage">
      <DRAWER.Screen
        name="LandingPage"
        component={LandingPage}
        options={{
          title: process.env.APP_TITLE,
        }}
      />
      <DRAWER.Screen
        name="GoogleSignIn"
        component={GoogleSignInScreen}
        options={{headerShown: false}}
      />
    </DRAWER.Navigator>
  );
};

export default DrawerNavigator;
