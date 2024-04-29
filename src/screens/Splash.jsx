import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  createContext,
} from 'react';
import {View, Text, Image} from 'react-native';

const Splash = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('GoogleSignIn');
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex justify-center items-center w-screen h-screen">
      <Image
        source={require('../assests/images/defaultImages/money-management.png')}
        className="w-40 h-40"
      />
    </View>
  );
};

export default Splash;
