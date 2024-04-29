/* eslint-disable no-unused-vars */
import React, {useEffect} from 'react';
import {View} from 'react-native';
import DrawerNavigator from '../navigations/DrawerNavigator';

const Home = () => {
  useEffect(() => {
    console.log('On Home Screen!');
  }, []);
  return (
    <View className="bg-white w-full h-full">
      <DrawerNavigator />
    </View>
  );
};

export default Home;
