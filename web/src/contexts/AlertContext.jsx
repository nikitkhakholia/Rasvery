import React, { useState } from "react";

// initializing alert context
const AlertContext = React.createContext();

export function AlertProvider({ children }) {
  alert(1)
  // state variable to store alerts comming from other components 
  const [alerts, setAlerts] = useState([]);

  // function to be passed to get a new alert and store in state variable above
  const addNewAlert = (newAlert) => {
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
  };
  // returning the context provider to be wrapper around other compoenets
  return (
    <AlertContext.Provider value={{ alerts, addNewAlert }}>
      {/* child/inner components to which provider is wrapped */}
      {children}
    </AlertContext.Provider>
  );
}

export default AlertContext;
