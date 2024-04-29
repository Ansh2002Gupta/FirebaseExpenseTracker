import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Splash from '../screens/Splash';
import GoogleSignInScreen from '../screens/GoogleSignInScreen';
import GlobalProvider from '../context/GlobalProvider';

const STACK = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <GlobalProvider>
      <NavigationContainer>
        <STACK.Navigator initialRouteName="Splash">
          <STACK.Screen
            name="Splash"
            component={Splash}
            options={{headerShown: false}}
          />
          <STACK.Screen
            name="GoogleSignIn"
            component={GoogleSignInScreen}
            options={{headerShown: false}}
          />
          <STACK.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          />
        </STACK.Navigator>
      </NavigationContainer>
    </GlobalProvider>
  );
};

export default AppNavigator;
