import React, {useEffect} from 'react';
import {View, Text} from 'react-native';

const Add = () => {
  useEffect(() => {
    console.log('On Add Screen!');
  }, []);
  return (
    <View>
      <Text className="text-3xl text-black">Add</Text>
    </View>
  );
};

export default Add;
