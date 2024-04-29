/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {View} from 'react-native';
import AppNavigator from './src/navigations/AppNavigator.jsx';

function App() {
  useEffect(() => {
    console.log('App On!');
  }, []);
  return <AppNavigator />;
  // return <GoogleSignInScreen />;
}

export default App;
