import React, {useState, createContext} from 'react';

export const GlobalContext = createContext();

const GlobalProvider = ({children}) => {
  const [userInfo, setUserInfo] = useState(null);
  const dataValues = {
    userInfo,
    setUserInfo,
  };
  return (
    <GlobalContext.Provider value={dataValues}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
