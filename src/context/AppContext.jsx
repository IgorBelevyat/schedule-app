import { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [week, setWeek] = useState(1);

  return (
    <AppContext.Provider value={{ selectedClass, setSelectedClass, week, setWeek }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
