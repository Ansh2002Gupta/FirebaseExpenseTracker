/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Image, Pressable, FlatList, StyleSheet} from 'react-native';
import {ActivityIndicator} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {GlobalContext} from '../context/GlobalProvider';
import {NativeContext} from '../context/NativeProvider';
import add from '../assests/images/icons/plus.png';
import LargeCard from '../components/LargeCard';
import Modal from '../components/Modal';
import SmallCard from '../components/SmallCard';

const Item = ({expenseData}) => {
  // console.log('expenseData:', expenseData);
  // console.log('expenseData:', expenseData.item.date);
  return <SmallCard expenseData={expenseData} />;
};

const Dashboard = () => {
  const {userInfo} = useContext(GlobalContext);
  const {
    loader,
    setLoader,
    showModal,
    setShowModal,
    showLargeCard,
    setExpenseInfo,
  } = useContext(NativeContext);
  const [userExpenses, setUserExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  //   console.log('showModal:', showModal);

  useEffect(() => {
    getAllUserExpenseTillNow();
  }, []);

  useEffect(() => {
    if (loader?.state) {
      getAllUserExpenseTillNow();
      const timer = setTimeout(
        () => setLoader(prev => ({...prev, state: false})),
        1500,
      );
      return () => clearTimeout(timer);
    }
  }, [loader]);

  const getAllUserExpenseTillNow = async () => {
    const expenseList = await fetchData();
    setUserExpenses(expenseList);
    console.log('expenseList:', expenseList);
  };

  const fetchData = async () => {
    const expensesList = [];
    var EMAIL = userInfo?.user?.email || userInfo._user?.email;
    // console.log('EMAIL:', EMAIL);
    try {
      const expensesRef = firestore()
        .collection('Expenditure')
        .doc(EMAIL)
        .collection('Expenses');
      const snapshot = await expensesRef.get();
      // console.log('snpashot:', snapshot);
      var totalSum = 0;
      snapshot.forEach(doc => {
        const expenseData = doc.data();
        totalSum = totalSum + parseInt(expenseData.amount, 10);
        expensesList.push({id: doc.id, ...expenseData});
      });
      setTotal(totalSum);
      return expensesList;
    } catch (error) {
      console.error('Error fetching data: ', error);
      return [];
    }
  };

  return (
    <View className="relative p-2" style={{flex: 1}}>
      {showModal && <Modal />}
      {showLargeCard && <LargeCard />}
      <Pressable
        onPress={() => {
          console.log('Pressed!');
          setExpenseInfo({
            selectedCategory: '',
            product: '',
            quantity: '',
            paidTo: '',
            amount: '',
            billImage: '',
          });
          setShowModal(true);
        }}
        style={{
          width: 60,
          height: 60,
          backgroundColor: '#48de80',
          borderRadius: 30,
          alignItems: 'center',
          position: 'absolute',
          zIndex: 10,
          bottom: 30,
          right: 30,
        }}
        className="flex justify-center items-center ">
        <Image
          source={add}
          style={{width: 25, height: 25, tintColor: 'white'}}
        />
      </Pressable>
      <Text
        style={styles.totalTag}
        className="my-2 text-center py-2 mx-2 rounded-sm text-2xl text-black bg-white">
        Total Expense:{' '}
        <Text className="text-black text-2xl font-bold">Rs. {total}</Text>
      </Text>
      {userExpenses && (
        <FlatList
          keyExtractor={element => element.id}
          data={userExpenses}
          renderItem={element => <Item expenseData={element} />}
        />
      )}
      {loader.state && (
        <View className="absolute top-0 left-0 flex justify-center items-center w-screen h-screen bg-black opacity-80 z-20">
          <ActivityIndicator size={40} color="#FFFF" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  shadowBox: {
    elevation: 5,
  },
  shadowImage: {
    elevation: 5,
  },
  totalTag: {
    elevation: 5,
    borderLeftColor: 'rgb(34 211 238)',
    borderRightColor: 'rgb(34 211 238)',
    borderLeftWidth: 4,
    borderRightWidth: 4,
  },
});
export default Dashboard;
