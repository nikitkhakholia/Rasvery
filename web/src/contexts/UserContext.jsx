import React from "react";

const UserContext = React.createContext();
export function UserProvider({ children }) {
  return <UserContext.Provider>{children}</UserContext.Provider>;
}

export default UserContext;
