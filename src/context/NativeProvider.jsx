/* eslint-disable react-hooks/rules-of-hooks */
import React, {createContext, useState} from 'react';
// import defaultImage from '../assests/images/defaultImages/money-management.png';
// import defaultImage from '../assests/images/defaultImages/defaultImage.png';

export const NativeContext = createContext(null);

const NativeProvider = ({children}) => {
  const [pressedEdit, setPressedEdit] = useState(false);
  const [loader, setLoader] = useState({state: false});
  const [showLargeCard, setShowLargeCard] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [detailsForLargeCard, setDetailsForLargeCard] = useState({});
  const [expenseInfo, setExpenseInfo] = useState({
    selectedCategory: '',
    product: '',
    quantity: '',
    paidTo: '',
    amount: '',
    billImage: '',
  });
  const dataValues = {
    pressedEdit,
    setPressedEdit,
    loader,
    setLoader,
    showModal,
    setShowModal,
    expenseInfo,
    setExpenseInfo,
    showLargeCard,
    setShowLargeCard,
    detailsForLargeCard,
    setDetailsForLargeCard,
  };
  return (
    <NativeContext.Provider value={dataValues}>
      {children}
    </NativeContext.Provider>
  );
};

export default NativeProvider;
