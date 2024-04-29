import React, {useEffect} from 'react';
import {View} from 'react-native';
import BottomNavigator from '../navigations/BottomNavigator';

const LandingPage = () => {
  useEffect(() => {
    console.log('on lading page!');
  }, []);
  return (
    <View className="flex justify-end bg-white w-full h-full">
      <BottomNavigator />
    </View>
  );
};
export default LandingPage;
