/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
import {View, Button, Image, Pressable, Text} from 'react-native';
import close from '../assests/images/icons/close.png';
import {launchImageLibrary} from 'react-native-image-picker';
import {launchCamera} from 'react-native-image-picker';
import {NativeContext} from '../context/NativeProvider';

const ImageHandler = () => {
  const [clickedUploadImageButton, setClickedUploadImageButton] =
    useState(false);
  const {expenseInfo, setExpenseInfo} = useContext(NativeContext);
  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        if (imageUri.length > 0) {
          setExpenseInfo(prev => ({...prev, billImage: imageUri}));
        }
      }
    });
  };

  const handleCameraLaunch = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchCamera(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else {
        // Process the captured image
        let imageUri = response.uri || response.assets?.[0]?.uri;
        if (imageUri.length > 0) {
          setExpenseInfo(prev => ({...prev, billImage: imageUri}));
          console.log(imageUri);
        }
      }
    });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
      }}>
      {expenseInfo?.billImage?.length > 0 && (
        <View className="relative h-[50%] px-4 border-2 border-slate-100 mx-4">
          <Image
            source={{uri: expenseInfo.billImage}}
            style={{flex: 1}}
            resizeMode="contain"
          />
          <Pressable
            onPress={() => {
              setExpenseInfo(prev => ({...prev, billImage: ''}));
            }}
            className="absolute top-[-10] right-[-8]">
            <Image
              source={close}
              style={{
                width: 20,
                height: 20,
                borderRadius: 100,
                backgroundColor: 'red',
                tintColor: 'white',
              }}
            />
          </Pressable>
        </View>
      )}
      {clickedUploadImageButton && (
        <View style={{marginTop: 8, width: 300, marginLeft: 40}}>
          <Button
            title="Choose from Device"
            color="#48de80"
            onPress={openImagePicker}
          />
        </View>
      )}
      {clickedUploadImageButton && (
        <View
          style={{marginTop: 14, width: 300, marginLeft: 40, marginBottom: 60}}>
          <Button
            title="Open Camera"
            color="#48de80"
            onPress={handleCameraLaunch}
          />
        </View>
      )}
      {!clickedUploadImageButton && (
        <View
          style={{marginTop: 14, width: 300, marginLeft: 40, marginBottom: 60}}>
          <Button
            title="Upload Bill"
            color="#48de80"
            onPress={() => setClickedUploadImageButton(true)}
          />
        </View>
      )}
    </View>
  );
};

export default ImageHandler;
