import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// initializing alert context
const FirebaseContext = React.createContext();

export function FirebaseProvider({ children }) {
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

  // google provider object
  const googleAuthProvider = new GoogleAuthProvider();

  // additional OAuth 2.0 scopes
  // provider.addScope('openid');
  // provider.addScope('profile');
  // provider.addScope('image');

  // creating auth object
  const auth = getAuth();
  signInWithPopup(auth, googleAuthProvider)
    .then((res) => {
      // Google Access Token
      const credential = GoogleAuthProvider.credentialFromResult(res);
      // firebase token
      const token = credential.accessToken;
      // user info.
      const user = res.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
    });

  // returning the context provider to be wrapper around other compoenets
  return (
    <FirebaseContext.Provider>
      {/* child/inner components to which provider is wrapped */}
      {children}
    </FirebaseContext.Provider>
  );
}

export default FirebaseContext;
