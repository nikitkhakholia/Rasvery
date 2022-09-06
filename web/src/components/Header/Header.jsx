import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AlertContext from "../../contexts/AlertContext";
import AlertFailure from "../Alerts/AlertFailure";
import AlertSuccess from "../Alerts/AlertSuccess";
import Login from "../Modals/Login";
import SignUp from "../Modals/SignUp";

import "./header.css";

export default function Header() {
  // react hook to navigate across different pages
  let navigate = useNavigate();

  // context variables and functions
  const { alerts, addNewAlert } = useContext(AlertContext);

  // state variables
  const [loginModal, showLoginModal] = useState(false);
  const [signUpModal, showSignUpModal] = useState(false);

  return (
    // header component
    <header className="tw-text-gray-800">
      {/* header bar */}
      <ul className="tw-flex tw-justify-between tw-items-center">
        {/* hamburger menu */}
        <li className="tw-mx-4 tw-my-3">
          <div
            className="hamburger"
            id="hamburger-1"
            onClick={(e) => {
              document
                .getElementById("hamburger-1")
                .classList.toggle("is-active");
            }}
          >
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>
        </li>
        {/* logo */}
        <li
          className="tw-mx-4 subpixel-antialiased tw-font-bold tw-text-4xl tw-tracking-wide tw-cursor-pointer tw-transition
                        hover:tw-scale-110
        "
          onClick={(e) => {
            navigate("/");
          }}
        >
          RàsBérry
        </li>
        {/* login button */}
        <li
          className="tw-mx-4 tw-cursor-pointer"
          onClick={(e) => showLoginModal(true)}
        >
          Log in
        </li>
        {/* user profile */}

      </ul>
      {/* login component */}
      {loginModal && (
        <Login
          showSignUpModal={showSignUpModal}
          showLoginModal={showLoginModal}
        />
      )}
      {/* sinup component */}
      {signUpModal && (
        <SignUp
          showSignUpModal={showSignUpModal}
          showLoginModal={showLoginModal}
        />
      )}
      {/* alerts area */}
      <div id="alerts" className="tw-absolute tw-right-0 tw-top-0 tw-max-w-sm">
        {alerts && alerts.map((alert, i) => {
          return alert.type === "success" ? (
            <AlertSuccess key={i}>{alert.data}</AlertSuccess>
          ) : (
            <AlertFailure key={i}>{alert.data}</AlertFailure>
          );
        })}
      </div>
    </header>
  );
}
