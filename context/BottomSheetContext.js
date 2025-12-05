import React, { createContext, useContext } from 'react';

export const BottomSheetContext = createContext({
  openSheet: (index = 0) => {},
  setTabBarRoute: (index = 0) => {},
  showAlert: (message, good=true, time=3000) => {},
  setShowDisconnectIndicator: (bool) => {},
});

export const useBottomSheet = () => useContext(BottomSheetContext);