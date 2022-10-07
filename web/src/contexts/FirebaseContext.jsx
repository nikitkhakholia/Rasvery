import React, { useContext } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import AlertContext from "./AlertContext";

// initializing firebase context
const FirebaseContext = React.createContext();

export function FirebaseProvider({ children }) {
  // context variables
  const { addNewAlert } = useContext(AlertContext);

  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAZVRC42z1Bnw0pIBnOR8H1GgXu3DgHGyc",
    authDomain: "rasberryindia.firebaseapp.com",
    projectId: "rasberryindia",
    storageBucket: "rasberryindia.appspot.com",
    messagingSenderId: "690556931100",
    appId: "1:690556931100:web:ac45da5c03e2b188ea63d9",
    measurementId: "G-H20J9VFK5G",
  };

  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);

  const openGooglePopup = () => {
    return new Promise((resolve, reject) => {
      // google provider object
      const googleAuthProvider = new GoogleAuthProvider();

      // additional OAuth 2.0 scopes
      // googleAuthProvider.addScope('openid');
      // googleAuthProvider.addScope('profile');
      // googleAuthProvider.addScope('image');

      // creating auth object
      const auth = getAuth();

      // open popup
      signInWithPopup(auth, googleAuthProvider)
        .then((res) => {
          // user info
          resolve({ user: res._tokenResponse });
        })
        .catch((error) => {
          // const errorCode = error.code;
          // const errorMessage = error.message;
          // The email of the user's account used.
          // const email = error.customData.email;
          // The AuthCredential type that was used.
          // const credential = GoogleAuthProvider.credentialFromError(error);
          // console.log(errorCode);
          // console.log(errorMessage);
          reject(error)
          addNewAlert({
            type: "failure",
            message: (
              <p>
                Google Login Failed...
                <br /> Try Again Later...
              </p>
            ),
          });
        });
    });
  };

  // returning the context provider to be wrapper around other compoenets
  return (
    <FirebaseContext.Provider value={{ firebaseApp, openGooglePopup }}>
      {/* child/inner components to which provider is wrapped */}
      {children}
    </FirebaseContext.Provider>
  );
}

export default FirebaseContext;
