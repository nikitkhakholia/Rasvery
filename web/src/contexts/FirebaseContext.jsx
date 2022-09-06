import React from "react";

// initializing alert context
const FirebaseContext = React.createContext();

export function FirebaseProvider({ children }) {
    alert(2)
  // returning the context provider to be wrapper around other compoenets
  return (
    <FirebaseContext.Provider>
      {/* child/inner components to which provider is wrapped */}
      <div>123</div>
    </FirebaseContext.Provider>
  );
}

export default FirebaseContext;
