/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {GlobalContext} from '../context/GlobalProvider';

var USER_DOCUMENT;

const GoogleSignInScreen = ({navigation}) => {
  const {setUserInfo} = useContext(GlobalContext);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '149075305228-bej56a0bmipmvem6vlngllu030iop2kp.apps.googleusercontent.com',
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoader(false);
    }, 2000);
    // console.log('auth.currentUser:', auth().currentUser);
    if (auth().currentUser) {
      auth().currentUser.getIdToken(true);
    }
    auth().onAuthStateChanged(user => {
      if (user) {
        // console.log(auth().currentUser);
        const temp = auth().currentUser;
        setUserInfo({...temp});
        navigation.navigate('Home');
        // console.log('user in');
      } else {
        navigation.navigate('GoogleSignIn');
        // console.log('user out');
      }
    });
    return () => {
      setLoader(true);
      clearTimeout(timer);
    };
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const usrInfo = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(
        usrInfo.idToken,
      );
      auth()
        .signInWithCredential(googleCredential)
        .then(res => {
          console.log('Entered data in Google Authentication database:', res);
        })
        .catch(e => {
          console.log(
            'Error while entering data into authentication database:',
            e,
          );
          Alert.alert(
            'Error',
            'Error while entering data into authentication database!',
            [{text: 'OK'}],
          );
        });
      console.log('userInfo:', usrInfo);
      setUserInfo(usrInfo);
      return usrInfo;
    } catch (error) {
      console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo(null); // Remember to remove the user from your app's state as well
      console.log('user signed out!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignIn = async () => {
    try {
      const usrInfo = await signIn();
      // const QUERY_SNAPSHOT = await firestore()
      //   .collection('Users')
      //   .where('email', '==', usrInfo.user.email)
      //   .get();
      // console.log('QUERY_SNAPSHOT:', QUERY_SNAPSHOT);
      // if (!QUERY_SNAPSHOT.empty) {
      //   console.log(
      //     'skipping entry of user details in the firestore as the user is not new!',
      //   );
      // } else
      if (usrInfo) {
        USER_DOCUMENT = firestore().collection('Users').doc(usrInfo.user.email);
        USER_DOCUMENT.set(
          {
            givenName: usrInfo.user.givenName,
            familyName: usrInfo.user.familyName,
            email: usrInfo.user.email,
            photo: usrInfo.user.photo,
          },
          {merge: true},
        )
          .then(() => {
            navigation.navigate('Home');
            console.log('User added!');
          })
          .catch(error => {
            console.log('Error in entry to data:', error);
            Alert.alert('Error', 'Error in entry to data!', [{text: 'OK'}]);
          });
      }
    } catch (error) {
      console.log('Error in signing in:', error);
      Alert.alert('Error', 'Error in signing in!', [{text: 'OK'}]);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <View className="relative">
      <ImageBackground
        source={require('../assests/images/backgroundImages/Wallpaper_GoogleSignInScreen.jpg')}
        resizeMode="cover"
        className="relative flex justify-center items-center w-screen h-screen">
        <View className="absolute top-0 left-0 w-screen h-screen bg-black opacity-50" />
        <Text className="text-4xl text-green-400 font-bold">
          {process.env.APP_TITLE}
        </Text>
        <Text className="text-lg text-white mt-2">
          {process.env.APP_SUBTITLE}
        </Text>
        <View className="mt-20 flex flex-col justify-center items-center">
          <Text className="text-white font-bold text-lg">Powered By</Text>
          <View className="flex flex-row justify-center items-center">
            <Text className="mt-2 text-2xl text-green-400 font-extrabold">
              Google
            </Text>
          </View>
        </View>
        <View className="absolute bottom-5 w-screen px-2 flex flex-row justify-center items-center gap-2">
          <Text
            className="text-2xl rounded-lg w-[90%] bg-green-400 text-center text-white hover:bg-green-500 px-4 py-2"
            onPress={() => {
              handleSignIn();
            }}>
            Sign In
          </Text>
          {/* <Text
            className="text-2xl rounded-lg w-[50%] bg-green-500 text-center text-white hover:bg-green-400 px-4 py-2"
            onPress={() => {
              handleSignOut();
            }}>
            Sign Out
          </Text> */}
        </View>
      </ImageBackground>
      {loader && (
        <View className="absolute top-0 left-0 flex justify-center items-center w-screen h-screen bg-black opacity-80">
          <ActivityIndicator size={40} color="#FFFF" />
        </View>
      )}
    </View>
  );
};

export default GoogleSignInScreen;
