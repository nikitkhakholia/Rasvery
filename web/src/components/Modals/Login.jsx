import React, { useContext } from "react";
import AlertContext from "../../contexts/AlertContext";
import { login } from "../Modals/apis";

export default function Login({ showSignUpModal, showLoginModal }) {
  // context variables
  const { addNewAlert } = useContext(AlertContext);

  return (
    <div
      className="tw-backdrop-blur-md tw-absolute tw-inset-0 tw-flex tw-justify-center tw-items-center"
      id="login-modal"
    >
      <div className="tw-w-96 md:tw-w-96 tw-shadow-xl tw-rounded-3xl">
        {/* modal header */}
        <div className="tw-relative tw-h-48 tw-bg-black tw-rounded-3xl">
          <svg
            className="tw-absolute tw-bottom-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#fff"
              fillOpacity="1"
              d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,122.7C960,160,1056,224,1152,245.3C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#fff"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#fff"
            className="tw-w-6 tw-h-6 tw-cursor-pointer tw-absolute tw-right-0 tw-m-3"
            onClick={(e) => {
              showLoginModal(false);
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        {/* modal body */}
        <div className="tw-px-10 tw-pt-4 tw-pb-8 tw-rounded-b-3xl">
          <h4 className="tw-font-semibold tw-text-xl tw-text-center">
            Welcome to RàsBérry
          </h4>
          <div className="tw-mt-6 tw-w-100 tw-m-1 tw-cursor-pointer tw-text-center tw-p-2 tw-rounded tw-border-black tw-border">
            Log in with Google
          </div>
          <p className="tw-mt-6 tw-text-center">-or-</p>
          <div className="">
            <div className="tw-mt-8 tw-relative">
              <input
                id="login-email"
                name="username"
                type="text"
                className="tw-peer tw-h-10 tw-w-full tw-border-b-2 tw-border-gray-300 tw-text-gray-900 tw-placeholder-transparent focus:tw-outline-none focus:tw-border-black"
                placeholder="john@doe.com"
              />
              <label
                htmlFor="login-email"
                className="tw-cursor-text tw-absolute tw-left-0 tw--top-3.5 tw-text-gray-600 tw-text-sm tw-transition-all peer-placeholder-shown:tw-text-base peer-placeholder-shown:tw-text-gray-400 peer-placeholder-shown:tw-top-2 peer-focus:tw--top-3.5 peer-focus:tw-text-gray-600 peer-focus:tw-text-sm"
              >
                Email/Mobile
              </label>
              <p className="tw-text-red-600 tw-hidden" id="login-email-error">
                Please enter a valid Email/Mobile.
              </p>
            </div>
            <div className="tw-mt-8 tw-relative">
              <input
                id="login-password"
                type="password"
                name="password"
                className="tw-peer tw-h-10 tw-w-full tw-border-b-2 tw-border-gray-300 tw-text-gray-900 tw-placeholder-transparent focus:tw-outline-none focus:tw-border-black"
                placeholder="Password"
              />
              <label
                htmlFor="login-password"
                className="tw-cursor-text tw-absolute tw-left-0 tw--top-3.5 tw-text-gray-600 tw-text-sm tw-transition-all peer-placeholder-shown:tw-text-base peer-placeholder-shown:tw-text-gray-400 peer-placeholder-shown:tw-top-2 peer-focus:tw--top-3.5 peer-focus:tw-text-gray-600 peer-focus:tw-text-sm"
              >
                Password
              </label>
              <p
                className="tw-text-red-600 tw-hidden"
                id="login-password-error"
              >
                Password must be 8 characters long.
              </p>
            </div>

            <div
              className="tw-mt-6 tw-px-4 tw-py-2 tw-rounded tw-bg-black hover:tw-bg-gray-900 tw-text-white tw-font-semibold tw-text-center tw-cursor-pointer"
              onClick={(e) => {
                // control form submit
                let submit = true;
                let focused = false;
                const email = document.getElementById("login-email");
                const password = document.getElementById("login-password");
                const emailError = document.getElementById("login-email-error");
                const passwordError = document.getElementById(
                  "login-password-error"
                );

                // validations
                if (
                  !email.value.match(
                    "^[\\w-\\.+]*[\\w-\\.]\\@([\\w]+\\.)+[\\w]+[\\w]$"
                  )
                ) {
                  // not email
                  if (!email.value.match(/^[0-9]{10}$/g)) {
                    // not mobile

                    // invalid
                    emailError.classList.add("tw-block");
                    emailError.classList.remove("tw-hidden");
                    submit = false;
                    if (!focused) {
                      focused = true;
                      email.focus();
                    }
                  } else {
                    // remove errors
                    emailError.classList.remove("tw-block");
                    emailError.classList.add("tw-hidden");
                  }
                } else {
                  // remove errors
                  emailError.classList.remove("tw-block");
                  emailError.classList.add("tw-hidden");
                }
                if (password.value.length < 8) {
                  // password error

                  // invalid
                  passwordError.classList.add("tw-block");
                  passwordError.classList.remove("tw-hidden");
                  submit = false;
                  if (!focused) {
                    focused = true;
                    password.focus();
                  }
                } else {
                  // remove errors
                  passwordError.classList.remove("tw-block");
                  passwordError.classList.add("tw-hidden");
                }
                // validated all correct
                if (submit) {
                  // variable to store user data to be sent
                  var data = {};
                  // adding email or mobile based on check
                  if (email.value.match(/^[0-9]{10}$/g)) {
                    data.mobile = email.value.trim();
                  } else {
                    data.email = email.value.trim();
                  }
                  data.password = password.value;
                  // call login api and handle the response
                  login(data).then((res) => {
                    if (res && !res.status) {
                      // error response status 0
                      addNewAlert({ type: "failure", data: res.error });
                    } else {
                      //clear field values
                      email.value = "";
                      password.value = "";
                      // storing authentication token for future use
                    }
                  });
                }
              }}
            >
              Log in
            </div>
          </div>
          <div className="tw-mt-4 tw-text-sm tw-text-center tw-font-medium tw-text-black hover:tw-underline tw-cursor-pointer">
            Forgot your password?
          </div>

          <hr className="tw-w-52 tw-mx-auto tw-my-3" />

          <div className="tw-text-sm tw-text-center tw-text-black tw-font-bold">
            Don't have an account?
          </div>

          <div
            className=" tw-text-sm tw-text-center tw-font-medium tw-text-black hover:tw-underline tw-cursor-pointer"
            onClick={(e) => {
              showSignUpModal(true);
              showLoginModal(false);
            }}
          >
            Sign up
          </div>
        </div>
      </div>
    </div>
  );
}
