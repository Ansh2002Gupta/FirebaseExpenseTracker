/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {View, Text, StyleSheet, Modal, Image, Pressable} from 'react-native';
import moment from 'moment';
import {NativeContext} from '../context/NativeProvider';
import defaultImage from '../assests/images/defaultImages/defaultImage.png';

const LargeCard = () => {
  const {showLargeCard, setShowLargeCard, detailsForLargeCard} =
    useContext(NativeContext);
  let date = moment(detailsForLargeCard?.date?.seconds * 1000);
  console.log('====================================');
  console.log(detailsForLargeCard);
  console.log('====================================');
  // console.log(detailsForLargeCard);

  const getTagColor = category => {
    switch (category.trim()) {
      case 'Stationary':
        return 'rgb(244 114 182)';
      case 'Grocery':
        return 'rgb(251 146 60)';
      case 'Snack':
        return 'rgb(251 191 36)';
      case 'Spicy Food':
        return 'rgb(250 204 21)';
      case 'Recharge':
        return 'rgb(163 230 53)';
      case 'Home product':
        return 'rgb(134 25 143)';
      case 'Fashion':
        return 'rgb(52 211 153)';
      case 'Sport':
        return 'rgb(45 212 191)';
      case 'Sweet':
        return 'rgb(131 24 67)';
      case 'Electronics':
        return 'rgb(49 46 129)';
      default:
        return 'rgb(248 113 113)';
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showLargeCard}
      onRequestClose={() => setShowLargeCard(false)}>
      <View style={[style.verticalRectangle, style.relative]}>
        <View
          style={[
            style.verticalRectangle,
            style.opacity,
            style.absoluteStart,
            style.inspectColor2,
          ]}
        />
        <View style={[style.modalBox]}>
          {/* Tag and Data here */}
          <View style={[style.container, style.flexBoxRow]}>
            <View
              style={[
                style.tagContainer,
                {borderColor: getTagColor(detailsForLargeCard.category.trim())},
              ]}>
              <Text
                style={[
                  style.tagText,
                  {color: getTagColor(detailsForLargeCard.category.trim())},
                ]}>
                {detailsForLargeCard.category.trim()}
              </Text>
            </View>
            <View>
              <Text style={[style.dateText]}>
                {moment(date.format('YYYY-MM-DD HH:mm:ss')).fromNow()}
              </Text>
            </View>
          </View>

          {/* Image here */}
          <View style={[style.ImageContainer]}>
            <Image
              source={
                detailsForLargeCard?.billImageURL?.length > 0
                  ? {uri: detailsForLargeCard.billImageURL}
                  : defaultImage
              }
              style={style.ImageFullSize}
              resizeMode="contain"
            />
          </View>
          <View style={style.productBox}>
            <Text style={style.productText}>{detailsForLargeCard.product}</Text>
            <Text
              style={
                style.costText
              }>{`Rs. ${detailsForLargeCard.amount}`}</Text>
          </View>
          <View style={style.extraDetailsBox}>
            <View style={style.extraDetailsSubBox}>
              <Text style={style.extraDetailsSubText}>Paid To:</Text>
              <Text style={style.extraDetailsSubText}>
                {detailsForLargeCard.paidTo}
              </Text>
            </View>
            <View style={style.extraDetailsSubBox}>
              <Text style={style.extraDetailsSubText}>Quantity:</Text>
              <Text style={style.extraDetailsSubText}>
                {detailsForLargeCard.quantity}
              </Text>
            </View>
            <View style={style.extraDetailsSubBox}>
              <Text style={style.extraDetailsSubText}>Location:</Text>
              <Text style={style.extraDetailsSubText}>Kanpur</Text>
            </View>
            <View style={style.extraDetailsSubBox}>
              <Text style={style.extraDetailsSubText}>Date:</Text>
              <Text style={style.extraDetailsSubText}>
                {date.format('YYYY-MM-DD HH:mm:ss')}
              </Text>
            </View>
            <View style={style.extraDetailsSubBox}>
              <Text style={style.extraDetailsSubText}>Tag:</Text>
              <Text style={style.extraDetailsSubText}>
                {detailsForLargeCard.category}
              </Text>
            </View>
          </View>
          <Pressable onPress={() => setShowLargeCard(false)}>
            <Text style={[style.button]}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const style = StyleSheet.create({
  button: {
    backgroundColor: 'rgb(185 28 28)',
    paddingHorizontal: 6,
    paddingVertical: 10,
    color: 'white',
    elevation: 2,
    marginHorizontal: 80,
    textAlign: 'center',
    borderRadius: 10,
    fontSize: 20,
    marginTop: 20,
  },
  extraDetailsSubText: {
    fontSize: 12,
    color: 'black',
  },
  extraDetailsSubBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  extraDetailsBox: {
    marginHorizontal: 40,
    marginVertical: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    borderLeftColor: 'rgb(74 222 128)',
    borderLeftWidth: 8,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  costText: {
    fontSize: 25,
    color: 'rgb(74 222 128)',
    fontWeight: '400',
  },
  productText: {
    fontSize: 25,
    color: 'black',
    fontWeight: '400',
  },
  productBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    flexWrap: 'wrap',
  },
  ImageFullSize: {width: '100%', height: '100%'},
  ImageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 250,
    padding: 20,
    elevation: 4,
  },
  container: {
    width: '100%',
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  modalBox: {
    marginHorizontal: 20,
    marginVertical: 20,
    backgroundColor: 'white',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    top: 0,
    left: 0,
    width: '90%',
    height: '85%',
    borderRadius: 10,
  },
  flexBoxRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  tagContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 15,
  },
  dateText: {
    fontSize: 15,
    color: 'rgb(148 163 184)',
  },
  inspectColor1: {
    backgroundColor: 'white',
  },
  inspectColor2: {
    backgroundColor: 'black',
  },
  absolute: {
    display: 'absolute',
  },
  relative: {
    display: 'relative',
  },
  opacity: {
    opacity: 0.5,
  },
  centerItems: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalRectangle: {
    width: '100%',
    height: '100%',
  },
  smallMargin: {
    marginVertical: 100,
    marginHorizontal: 100,
  },
  absoluteStart: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  textHeading: {
    fontSize: 50,
    color: 'black',
  },
  centeredView: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default LargeCard;
