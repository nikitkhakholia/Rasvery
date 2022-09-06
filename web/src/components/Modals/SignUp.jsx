import React, { useContext } from "react";
import AlertContext from "../../contexts/AlertContext";
import { checkIfUserExists, generateOtp } from "../Modals/apis";

export default function SignUp({ showSignUpModal, showLoginModal }) {
  // context variables
  const { addNewAlert } = useContext(AlertContext);

  return (
    <div
      className="tw-backdrop-blur-md tw-absolute tw-inset-0 tw-flex tw-justify-center tw-items-center"
      id="signup-modal"
    >
      <div className="tw-w-96 md:tw-w-96 tw-shadow-xl tw-rounded-3xl tw-bg-white">
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
              showSignUpModal(false);
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
            Sign up with Google
          </div>
          <p className="tw-mt-6 tw-text-center">-or-</p>
          <div className="">
            <div className="tw-mt-8 tw-relative">
              <input
                id="signup-name"
                name="name"
                type="text"
                className="tw-peer tw-h-10 tw-w-full tw-border-b-2 tw-border-gray-300 tw-text-gray-900 tw-placeholder-transparent focus:tw-outline-none focus:tw-border-black"
                placeholder="john@doe.com"
              />
              <label
                htmlFor="signup-name"
                className="tw-cursor-text tw-absolute tw-left-0 tw--top-3.5 tw-text-gray-600 tw-text-sm tw-transition-all peer-placeholder-shown:tw-text-base peer-placeholder-shown:tw-text-gray-400 peer-placeholder-shown:tw-top-2 peer-focus:tw--top-3.5 peer-focus:tw-text-gray-600 peer-focus:tw-text-sm"
              >
                Name
              </label>
              <p className="tw-text-red-600 tw-hidden" id="signup-name-error">
                Please enter a valid Name.
              </p>
            </div>
            <div className="tw-mt-8 tw-relative">
              <input
                id="signup-email"
                name="username"
                type="text"
                className="tw-peer tw-h-10 tw-w-full tw-border-b-2 tw-border-gray-300 tw-text-gray-900 tw-placeholder-transparent focus:tw-outline-none focus:tw-border-black"
                placeholder="john@doe.com"
              />
              <label
                htmlFor="signup-email"
                className="tw-cursor-text tw-absolute tw-left-0 tw--top-3.5 tw-text-gray-600 tw-text-sm tw-transition-all peer-placeholder-shown:tw-text-base peer-placeholder-shown:tw-text-gray-400 peer-placeholder-shown:tw-top-2 peer-focus:tw--top-3.5 peer-focus:tw-text-gray-600 peer-focus:tw-text-sm"
              >
                Email/Mobile
              </label>
              <p className="tw-text-red-600 tw-hidden" id="signup-email-error">
                Please enter a valid Email/Mobile.
              </p>
            </div>
            <div className="tw-mt-8 tw-relative">
              <input
                id="signup-password"
                type="password"
                name="password"
                className="tw-peer tw-h-10 tw-w-full tw-border-b-2 tw-border-gray-300 tw-text-gray-900 tw-placeholder-transparent focus:tw-outline-none focus:tw-border-black"
                placeholder="Password"
              />
              <label
                htmlFor="signup-password"
                className="tw-cursor-text tw-absolute tw-left-0 tw--top-3.5 tw-text-gray-600 tw-text-sm tw-transition-all peer-placeholder-shown:tw-text-base peer-placeholder-shown:tw-text-gray-400 peer-placeholder-shown:tw-top-2 peer-focus:tw--top-3.5 peer-focus:tw-text-gray-600 peer-focus:tw-text-sm"
              >
                Password
              </label>
              <p
                className="tw-text-red-600 tw-hidden"
                id="signup-password-error"
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
                const name = document.getElementById("signup-name");
                const email = document.getElementById("signup-email");
                const password = document.getElementById("signup-password");
                const nameError = document.getElementById("signup-name-error");
                const emailError =
                  document.getElementById("signup-email-error");
                const passwordError = document.getElementById(
                  "signup-password-error"
                );

                // validations
                if (name.value.length < 3) {
                  // name error

                  // invalid
                  nameError.classList.add("tw-block");
                  nameError.classList.remove("tw-hidden");
                  submit = false;
                  if (!focused) {
                    focused = true;
                    name.focus();
                  }
                } else {
                  // remove errors
                  nameError.classList.remove("tw-block");
                  nameError.classList.add("tw-hidden");
                }

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
                  data.name = name.value;
                  // check if the user is already registered
                  checkIfUserExists(data).then((res) => {
                    if (res && res.status == "ok") {
                      //user not registered, generating otp
                      generateOtp({ to: email.value }).then((res) => {
                        if (res && res.status) {
                          //otp generated
                          addNewAlert({
                            type: "success",
                            data: "OTP sent successfully.",
                          });
                          // disabling existing inputs
                          name.classList.add("tw-cursor-not-allowed")
                          name.disabled=true

                          email.classList.add("tw-cursor-not-allowed")
                          email.disabled=true

                          password.classList.add("tw-cursor-not-allowed")
                          password.disabled=true
                        } else {
                          //otp not generated
                          addNewAlert({
                            type: "failure",
                            data: "Failed to generate OTP. Please try later.",
                          });
                        }
                      });
                    } else {
                      //user already registered
                      addNewAlert({
                        type: "failure",
                        data: "You are already registered. Please try Logging in reset your password.",
                      });
                    }
                  });
                }
              }}
            >
              Register
            </div>
          </div>

          <div className=" tw-mt-3 tw-text-sm tw-text-center tw-text-black tw-font-bold">
            Already have an account?
          </div>

          <div
            className=" tw-text-sm tw-text-center tw-font-medium tw-text-black hover:tw-underline tw-cursor-pointer"
            onClick={(e) => {
              showLoginModal(true);
              showSignUpModal(false);
            }}
          >
            Log in
          </div>
        </div>
      </div>
    </div>
  );
}
