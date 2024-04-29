/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';
import {GlobalContext} from '../context/GlobalProvider';
import {NativeContext} from '../context/NativeProvider';
import close from '../assests/images/icons/close.png';
import ImageHandler from '../components/ImageHandler';
import storage from '@react-native-firebase/storage';

const Modal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({state: false, id: -1, message: ''});
  const {
    setLoader,
    setShowModal,
    expenseInfo,
    setExpenseInfo,
    pressedEdit,
    setPressedEdit,
  } = useContext(NativeContext);
  const {userInfo} = useContext(GlobalContext);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  var EXPENDITURE_COLLECTION;

  const PLACEHOLDER = {
    label: 'SELECT AN OPTION',
    value: null,
  };
  const OPTIONS = [
    {
      label: 'Grocery',
      value: 'Grocery',
    },
    {
      label: 'Spicy Food',
      value: 'Spicy Food',
    },
    {
      label: 'Stationary',
      value: 'Stationary',
    },
    {
      label: 'Recharge',
      value: 'Recharge',
    },
    {
      label: 'Snack',
      value: 'Snack',
    },
    {
      label: 'Home product',
      value: 'Home product',
    },
    {
      label: 'Sweet',
      value: 'Sweet',
    },
    {
      label: 'Fashion',
      value: 'Fashion',
    },
    {
      label: 'Electronics',
      value: 'Electronics',
    },
    {
      label: 'Sport',
      value: 'Sport',
    },
  ];

  useEffect(() => {
    const {selectedCategory, product, quantity, paidTo, amount} = expenseInfo;
    // console.log('MODAL | expenseInfo:', expenseInfo);
    if (
      !pressedEdit &&
      selectedCategory?.length > 0 &&
      product?.length > 0 &&
      quantity?.length > 0 &&
      paidTo?.length > 0 &&
      amount?.length > 0
    ) {
      setShowSubmitButton(true);
    }
    // console.log('userInfo:', userInfo._user.email);
  }, [expenseInfo]);

  useEffect(() => {
    console.log('new useEffect | expenseInfo:', expenseInfo);
    if (pressedEdit && expenseInfo?.billImage?.length) {
      setShowSubmitButton(true);
    }
  }, [expenseInfo.billImage]);

  useEffect(() => {
    if (error.state) {
      const timer = setTimeout(() => {
        setError(prev => ({...prev, state: false, message: ''}));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const submitExpenseToDB = async () => {
    //update request
    if (expenseInfo?.ID?.length > 0) {
      await handleUpdateRequest();
    } else {
      await handleAddRequest();
    }
  };

  const handleUpdateRequest = async () => {
    setLoading(true);
    console.log('update pressed!');
    var billImageURL = '';
    console.log('expenseInfo | SUBMITEXPENSETODB:', expenseInfo);
    console.log(
      'Email | SUBMITEXPENSETODB:',
      userInfo?.user?.email || userInfo?._user?.email,
    );
    let isURL = false;
    let billImage = '';
    if (expenseInfo?.billImage?.length > 0) {
      isURL = expenseInfo?.billImage.startsWith('https://');
      if (!isURL) {
        try {
          billImage = expenseInfo.billImage;
          const reference = storage().ref(billImage);
          await reference.putFile(billImage);
          billImageURL = await reference.getDownloadURL();
          console.log('billImageURL:', billImageURL);
          var EMAIL = userInfo?.user?.email || userInfo._user?.email;
          console.log('email', EMAIL);
        } catch (err) {
          console.log('[ERROR] while getting imageURL from firestore:', err);
        }
      } else {
        setLoading(false);
        console.log('[MESSAGE]: Update your bill please!');
        Alert.alert('Message', 'Update your bill please!', [{text: 'OK'}]);
        return;
      }
    }
    try {
      let DOCUMENT_REFERENCE = firestore()
        .collection('Expenditure')
        .doc(EMAIL)
        .collection('Expenses')
        .doc(expenseInfo?.ID);
      console.log('documentReference:', DOCUMENT_REFERENCE);
      await DOCUMENT_REFERENCE.update({
        category: expenseInfo?.selectedCategory,
        product: expenseInfo?.product,
        quantity: expenseInfo?.quantity,
        paidTo: expenseInfo?.paidTo,
        amount: expenseInfo?.amount,
        billImageURL: billImageURL,
        date: firestore.FieldValue.serverTimestamp(),
      });
      console.log('ITEM UPDATED SUCCESSFULLY!');
      setLoading(false);
      setShowModal(false);
      setLoader(prev => ({...prev, state: true}));
    } catch (err) {
      console.log('[ERROR 163] | while updating: ', err);
    }
  };

  const handleAddRequest = async () => {
    setLoading(true);
    console.log('submit pressed!');
    var billImageURL = '';
    console.log('expenseInfo | SUBMITEXPENSETODB:', expenseInfo);
    console.log(
      'Email | SUBMITEXPENSETODB:',
      userInfo?.user?.email || userInfo?.user?.email || userInfo?._user?.email,
    );
    try {
      if (expenseInfo?.billImage?.length > 0) {
        let billImage = expenseInfo.billImage;
        const reference = storage().ref(billImage);
        await reference.putFile(billImage);
        billImageURL = await reference.getDownloadURL();
        console.log('billImageURL:', billImageURL);
      }
      var EMAIL = userInfo?.user?.email || userInfo._user?.email;
      console.log('email', EMAIL);
      EXPENDITURE_COLLECTION = firestore()
        .collection('Expenditure')
        .doc(EMAIL)
        .collection('Expenses');
      EXPENDITURE_COLLECTION.add({
        category: expenseInfo?.selectedCategory,
        product: expenseInfo?.product,
        quantity: expenseInfo?.quantity,
        paidTo: expenseInfo?.paidTo,
        amount: expenseInfo?.amount,
        billImageURL: billImageURL,
        date: firestore.FieldValue.serverTimestamp(),
      });
      setLoading(false);
      setShowModal(false);
      setLoader(prev => ({...prev, state: true}));
      console.log(
        '[MESSAGE]: A new expense for the current user has been added to the firestore!',
      );
    } catch (err) {
      console.log('[ERROR] while adding data to firestore:', err);
      setLoading(false);
      setShowModal(false);
      setLoader(prev => ({...prev, state: true}));
    }
  };

  return (
    <View className="absolute z-20 top-0 left-0 w-screen h-screen">
      <View className="bg-black opacity-50 w-screen h-screen" />
      <View className="absolute top-0 m-4 bg-white">
        <View className="flex flex-col bg-white rounded-sm w-[92vw] h-[80vh]">
          <View className="w-full flex flex-row justify-between items-center">
            <Text className="text-xl text-green-400 mx-4 my-2 font-bold">
              Details
            </Text>
            <Pressable
              onPress={() => {
                setShowModal(false);
              }}
              className="rounded-full w-10 h-10 flex justify-center items-center my-2 mr-2">
              <Image
                source={close}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 100,
                  backgroundColor: 'red',
                  tintColor: 'white',
                }}
              />
            </Pressable>
          </View>
          <View className="mx-4 h-[2px] bg-green-400" />
          <View className="my-2 flex flex-col px-8">
            <View className="flex flex-row justify-between items-center">
              <Text className="text-black text-lg mb-2">Category:</Text>
              <RNPickerSelect
                placeholder={PLACEHOLDER}
                items={OPTIONS}
                onValueChange={value => {
                  setPressedEdit(false);
                  setExpenseInfo(prevState => ({
                    ...prevState,
                    selectedCategory: value,
                  }));
                }}
                value={expenseInfo.selectedCategory}
                useNativeAndroidPickerStyle={false}
                style={pickerSelectStyling}
              />
            </View>
            <View className="flex flex-row justify-between mt-2">
              <Text className="text-black text-lg mb-2">Product:</Text>
              <View className="flex flex-col justify-center items-center h-[40px] gap-[2px]">
                <TextInput
                  maxLength={25}
                  value={expenseInfo.product}
                  onChangeText={value => {
                    setPressedEdit(false);
                    if (/[^A-Za-z]/g.test(value)) {
                      setError(prev => ({
                        ...prev,
                        state: true,
                        id: 1,
                        message: 'Only alphabets allowed!',
                      }));
                      // Alert.alert(
                      //   'Wrong Input',
                      //   'Only alphabets allowed',
                      //   [{text: 'OK'}],
                      //   {cancelable: false},
                      // );
                    } else {
                      setExpenseInfo(prevState => ({
                        ...prevState,
                        product: value,
                      }));
                    }
                  }}
                  className="text-center text-black p-0 border-b-2 border-black w-[50vw]"
                />
                {error.state && error.id === 1 && (
                  <Text className="text-red-600 text-xs">{error.message}</Text>
                )}
              </View>
            </View>
            <View className="flex flex-row justify-between mt-2">
              <Text className="text-black text-lg mb-2">Quantity:</Text>
              <View className="flex flex-col justify-center items-center h-[40px] gap-[2px]">
                <TextInput
                  maxLength={25}
                  value={expenseInfo.quantity}
                  onChangeText={value => {
                    setPressedEdit(false);
                    if (!/^\d*\.?\d*$/.test(value)) {
                      setError(prev => ({
                        ...prev,
                        state: true,
                        id: 2,
                        message: 'Please enter a valid quantity!',
                      }));
                      // Alert.alert(
                      //   'Wrong Input',
                      //   'Please enter a valid quantity',
                      //   [{text: 'OK'}],
                      //   {cancelable: false},
                      // );
                    } else {
                      setExpenseInfo(prevState => ({
                        ...prevState,
                        quantity: value,
                      }));
                    }
                  }}
                  keyboardType="numeric"
                  className="text-center text-black p-0 border-b-2 border-black w-[50vw]"
                />
                {error.state && error.id === 2 && (
                  <Text className="text-red-600 text-xs">{error.message}</Text>
                )}
              </View>
            </View>
            <View className="flex flex-row justify-between mt-2">
              <Text className="text-black text-lg mb-2">Paid To:</Text>
              <View className="flex flex-col justify-center items-center h-[40px] gap-[2px]">
                <TextInput
                  maxLength={25}
                  value={expenseInfo.paidTo}
                  onChangeText={value => {
                    setPressedEdit(false);
                    if (/[^A-Za-z]/g.test(value)) {
                      setError(prev => ({
                        ...prev,
                        id: 3,
                        state: true,
                        message: 'Only alphabets allowed!',
                      }));
                      // Alert.alert(
                      //   'Wrong Input',
                      //   'Only alphabets allowed',
                      //   [{text: 'OK'}],
                      //   {cancelable: false},
                      // );
                    } else {
                      setExpenseInfo(prevState => ({
                        ...prevState,
                        paidTo: value,
                      }));
                    }
                  }}
                  className="text-center text-black p-0 border-b-2 border-black w-[50vw]"
                />
                {error.state && error.id === 3 && (
                  <Text className="text-red-600 text-xs">{error.message}</Text>
                )}
              </View>
            </View>
            <View className="flex flex-row justify-between mt-2">
              <Text className="text-black text-lg mb-2">Amount:</Text>
              <View className="flex flex-col justify-center items-center h-[40px] gap-[2px]">
                <TextInput
                  maxLength={25}
                  value={expenseInfo.amount}
                  onChangeText={value => {
                    setPressedEdit(false);
                    if (!/^\d*\.?\d*$/.test(value)) {
                      setError(prev => ({
                        ...prev,
                        id: 4,
                        state: true,
                        message: 'Please enter a valid amount!',
                      }));
                      // Alert.alert(
                      //   'Wrong Input',
                      //   'Please enter a valid amount',
                      //   [{text: 'OK'}],
                      //   {cancelable: false},
                      // );
                    } else {
                      setExpenseInfo(prevState => ({
                        ...prevState,
                        amount: value,
                      }));
                    }
                  }}
                  keyboardType="numeric"
                  className="text-center text-black p-0 border-b-2 border-black w-[50vw]"
                />
                {error.state && error.id === 4 && (
                  <Text className="text-red-600 text-xs">{error.message}</Text>
                )}
              </View>
            </View>
            <View className="flex flex-row mt-2">
              <Text className="text-black text-lg">Bill Image:</Text>
              <Text className="text-xs text-black text-green-500">
                {'(if any)'}
              </Text>
            </View>
          </View>
          <ImageHandler />
          {showSubmitButton && (
            <Pressable
              onPress={() => {
                submitExpenseToDB();
              }}
              className="bg-green-400 w-full h-10 flex justify-center items-center">
              <Text className="text-white text-center text-lg font-bold">
                SUBMIT
              </Text>
            </Pressable>
          )}
          {loading && (
            <View className="flex flex-col  justify-center items-center absolute top-0 left-0 bg-black w-full h-full opacity-50">
              <ActivityIndicator size={40} color="#48de80" />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const pickerSelectStyling = StyleSheet.create({
  inputAndroid: {
    textAlign: 'center',
    fontSize: 14,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    color: 'black',
  },
});

export default Modal;
