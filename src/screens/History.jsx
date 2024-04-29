/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Image, FlatList, StyleSheet, Pressable} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import {GlobalContext} from '../context/GlobalProvider';
import {NativeContext} from '../context/NativeProvider';
import add from '../assests/images/icons/plus.png';
import Modal from '../components/Modal';
import SmallCard from '../components/SmallCard';

const Item = ({expenseData}) => {
  return <SmallCard expenseData={expenseData} />;
};

const History = () => {
  const {showModal, setShowModal, setExpenseInfo} = useContext(NativeContext);
  const {userInfo} = useContext(GlobalContext);
  const [totalHistory, setTotalHistory] = useState(0);
  const [userExpenseHistory, setUserExpenseHistory] = useState([]);

  const today = moment().startOf('day');
  console.log('today:', today);
  const sevenDaysBefore = today.clone().subtract(7, 'days');
  console.log('sevenDaysBefore:', sevenDaysBefore);

  useEffect(() => {
    fetchAllExpensesFromLastSevenDays();
  }, []);

  const fetchAllExpensesFromLastSevenDays = async () => {
    const list = await fetchData();
    setUserExpenseHistory(list);
  };

  const fetchData = async () => {
    const expensesList = [];
    let totalHistorySum = 0;
    const lastSevenDayTimestamp = firestore.Timestamp.fromDate(
      sevenDaysBefore.toDate(),
    );
    var EMAIL = userInfo?.user?.email || userInfo._user?.email;
    try {
      const expensesRef = firestore()
        .collection('Expenditure')
        .doc(EMAIL)
        .collection('Expenses');
      const querySnapshot = await expensesRef
        .where('date', '>=', lastSevenDayTimestamp)
        .get();
      const documents = await querySnapshot.docs;
      console.log('document:', documents);
      documents.forEach(doc => {
        const expenseData = doc.data();
        totalHistorySum = totalHistorySum + parseInt(expenseData.amount, 10);
        expensesList.push({id: doc.id, ...expenseData});
      });
      setTotalHistory(totalHistorySum);
      return expensesList;
    } catch (error) {
      console.error('Error fetching data | HISTORY: ', error);
      return [];
    }
  };

  return (
    <View style={{flex: 1}} className="p-2">
      {showModal && <Modal />}
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
        <Text className="text-black text-2xl font-bold">
          Rs. {totalHistory}
        </Text>
      </Text>
      {userExpenseHistory && (
        <FlatList
          keyExtractor={element => element.id}
          data={userExpenseHistory}
          renderItem={element => <Item expenseData={element} />}
        />
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

export default History;
