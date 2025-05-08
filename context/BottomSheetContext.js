import React, { createContext, useContext } from 'react';

export const BottomSheetContext = createContext({
  openSheet: (index = 0) => {},
});

export const useBottomSheet = () => useContext(BottomSheetContext);