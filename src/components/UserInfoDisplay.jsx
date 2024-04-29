import React, {useContext, useEffect} from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {GlobalContext} from '../context/GlobalProvider';
import {useNavigation} from '@react-navigation/native';

const UserInfoDisplay = () => {
  const {userInfo, setUserInfo} = useContext(GlobalContext);
  const navigation = useNavigation();
  const userDetails =
    userInfo?.user ||
    userInfo?.user?.providerData ||
    userInfo?._user.providerData[0];
  console.log('====================================');
  console.log('UserDetails | userInfoDisplay: ', userDetails);
  console.log('====================================');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '149075305228-bej56a0bmipmvem6vlngllu030iop2kp.apps.googleusercontent.com',
    });
  }, []);

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      navigation.navigate('GoogleSignIn');
      setUserInfo(null);
      console.log('user signed out!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <View style={[style.outerContainer]}>
      <View style={[style.innerContainer]}>
        <Image
          source={{
            uri:
              userDetails?.photo?.length > 0
                ? userDetails.photo
                : userDetails.photoURL,
          }}
          style={style.imageStyling}
        />
        <View style={style.detailsSubContainer}>
          {/* <Text style={style.headingText}>
            Hi!{' '}
          </Text> */}
          <Text style={style.headingText}>
            {userDetails?.name?.length > 0
              ? userDetails.name
              : userDetails.displayName}
          </Text>
          {/* <Text style={style.headingText}>Email:</Text> */}
          <Text style={style.subHeadingText}>{userDetails.email}</Text>
          <Text style={style.subHeadingText}>
            {userDetails?.id?.length > 0 ? userDetails.id : userDetails.uid}
          </Text>
          {/* <Text style={style.headingText}>
            uid:{' '}
            
          </Text> */}
        </View>
      </View>
      <Pressable
        onPress={() => {
          handleSignOut();
        }}>
        <Text style={style.logoutButton}>Logout</Text>
      </Pressable>
    </View>
  );
};

const style = StyleSheet.create({
  outerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'pink',
    width: '100%',
    height: '100%',
    paddingVertical: 20,
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 20,
    width: '100%',
    borderBottomColor: '#48de80',
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderTopColor: '#48de80',
    elevation: 3,
  },
  imageStyling: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  detailsSubContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  headingText: {
    fontSize: 13,
    color: 'black',
  },
  subHeadingText: {
    fontSize: 10,
    color: 'rgb(100 116 139)',
  },
  logoutButton: {
    paddingHorizontal: 70,
    paddingVertical: 15,
    backgroundColor: 'red',
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    borderRadius: 5,
    marginTop: 30,
  },
});

export default UserInfoDisplay;
