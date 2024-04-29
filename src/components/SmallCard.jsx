/* eslint-disable react-native/no-inline-styles */
/* eslint-disable curly */
import React, {useContext} from 'react';
import {View, Text, Image, Pressable} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import {GlobalContext} from '../context/GlobalProvider';
import {NativeContext} from '../context/NativeProvider';
import defaultImage from '../assests/images/defaultImages/defaultImage.png';
import edit from '../assests/images/icons/pencil.png';
import remove from '../assests/images/icons/trash.png';

const SmallCard = ({expenseData}) => {
  const {
    setPressedEdit,
    setLoader,
    setShowModal,
    setShowLargeCard,
    setDetailsForLargeCard,
    setExpenseInfo,
  } = useContext(NativeContext);
  const {userInfo} = useContext(GlobalContext);
  //   console.log('expenseData', expenseData);
  const date = moment(expenseData.item.date.seconds * 1000);
  var tagColor;

  const getTagColor = category => {
    switch (category.trim()) {
      case 'Stationary':
        tagColor = 'rgb(244 114 182)';
        return {
          backgroundColor: 'rgb(244 114 182)',
        };
      case 'Grocery':
        tagColor = 'rgb(251 146 60)';
        return {
          backgroundColor: 'rgb(251 146 60)',
        };
      case 'Snack':
        tagColor = 'rgb(251 191 36)';
        return {backgroundColor: 'rgb(251 191 36)'};
      case 'Spicy Food':
        tagColor = 'rgb(250 204 21)';
        return {backgroundColor: 'rgb(250 204 21)'};
      case 'Recharge':
        tagColor = 'rgb(163 230 53)';
        return {backgroundColor: 'rgb(163 230 53)'};
      case 'Home product':
        tagColor = 'rgb(134 25 143)';
        return {backgroundColor: 'rgb(134 25 143)'};
      case 'Fashion':
        tagColor = 'rgb(52 211 153)';
        return {backgroundColor: 'rgb(52 211 153)'};
      case 'Sport':
        tagColor = 'rgb(45 212 191)';
        return {backgroundColor: 'rgb(45 212 191)'};
      case 'Sweet':
        tagColor = 'rgb(131 24 67)';
        return {backgroundColor: 'rgb(131 24 67)'};
      case 'Electronics':
        tagColor = 'rgb(49 46 129)';
        return {backgroundColor: 'rgb(49 46 129)'};
      default:
        tagColor = 'rgb(248 113 113)';
        return {backgroundColor: 'rgb(248 113 113)'};
    }
  };

  const handleDelete = async ID => {
    var EMAIL = userInfo?.user?.email || userInfo._user?.email;
    try {
      const result = await firestore()
        .collection('Expenditure')
        .doc(EMAIL)
        .collection('Expenses')
        .doc(ID)
        .delete();
      console.log('result(deletion):', result);
      console.log('Deletion successfull!');
    } catch (err) {
      console.log('[ERROR] | while deleting item!');
    }
    setLoader(prev => ({...prev, state: false}));
  };

  const handleUpdate = async ID => {
    setShowModal(true);
    setPressedEdit(true);
    var EMAIL = userInfo?.user?.email || userInfo._user?.email;
    const expenseObj = await firestore()
      .collection('Expenditure')
      .doc(EMAIL)
      .collection('Expenses')
      .doc(ID)
      .get();
    console.log('EXPENSEObj:', expenseObj._data);
    const {amount, billImageURL, category, paidTo, product, quantity} =
      expenseObj._data;
    console.log(
      `amount:${amount} | paidTo: ${paidTo} | quantity: ${quantity} | category: ${category}`,
    );
    setExpenseInfo({
      amount: amount,
      billImage: billImageURL,
      selectedCategory: category,
      paidTo: paidTo,
      product: product,
      quantity: quantity,
      ID: ID,
    });
    setLoader(prev => ({...prev, state: false}));
  };

  return (
    <Pressable
      onPress={() => {
        setDetailsForLargeCard(expenseData.item);
        setShowLargeCard(true);
      }}>
      <View className="flex flex-col">
        <View
          className="w-28 flex items-center rounded-t-full"
          style={getTagColor(expenseData.item.category)}>
          <Text className="text-white font-bold">
            {expenseData.item.category}
          </Text>
        </View>
        <View
          style={{
            borderLeftColor: tagColor,
            borderLeftWidth: 2,
            elevation: 5,
          }}
          className="flex flex-row justify-between bg-white py-4 px-2 mb-2 items-center">
          <View style={{elevation: 5}}>
            <Image
              source={
                expenseData?.item?.billImageURL?.length > 0
                  ? {uri: expenseData?.item?.billImageURL}
                  : defaultImage
              }
              style={{width: 60, height: 60}}
              className="rounded-sm"
            />
          </View>
          <View className="flex flex-col">
            <View className="flex flex-row gap-6 justify-end mb-2">
              <Pressable
                onPress={() => {
                  setLoader(prev => ({...prev, state: true}));
                  handleUpdate(expenseData.item.id);
                }}>
                <Image
                  source={edit}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: 'rgb(8 145 178)',
                    backgroundColor: 'white',
                    // borderRadius: 10,
                  }}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setLoader(prev => ({...prev, state: true}));
                  handleDelete(expenseData.item.id);
                }}>
                <Image
                  source={remove}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: 'rgb(220 38 38)',
                    backgroundColor: 'white',
                  }}
                />
              </Pressable>
            </View>
            <View className="flex flex-row justify-between items-end gap-4">
              <Text className="text-lg text-black">
                {expenseData.item.product}
              </Text>
              <Text className="text-black text-lg">{`Rs. ${expenseData.item.amount}`}</Text>
            </View>
            <View className="flex items-end">
              <Text className="text-slate-400 text-sm">
                {date.format('YYYY-MM-DD HH:mm:ss')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default SmallCard;
