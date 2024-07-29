import { useAptimusFlow } from 'aptimus-sdk-test/react';
import React, { useContext, useEffect } from 'react'
import CurrentContext, { CurrentContextType } from '../contexts/CurrentProdiver';

export const useCurrent = () => {
    const context = useContext(CurrentContext);
    if (context === undefined) {
      throw new Error("useCurrent must be used within an CurrentProvider");
    }
    return context as CurrentContextType;
  };
  
export default useCurrent;

