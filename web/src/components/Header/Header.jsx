import React from "react";
import { useNavigate } from "react-router-dom";

import "./header.css";
export default function Header() {
  let navigate = useNavigate();

  const openLogin = () => {
    var loginModal = document.querySelector("#login-modal");
    loginModal.classList.remove("tw-hidden");
    loginModal.classList.add("tw-flex");
  };
  const closeLogin = () => {
    var loginModal = document.querySelector("#login-modal");
    loginModal.classList.add("tw-hidden");
    loginModal.classList.remove("tw-flex");
  };

  return (
    <header className="tw-text-gray-800">
      <ul className="tw-flex tw-justify-between tw-items-center">
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
        <li className="tw-mx-4 tw-cursor-pointer" onClick={openLogin}>
          Log in
        </li>
      </ul>
      <div
        className="tw-backdrop-blur-md tw-absolute tw-inset-0 tw-hidden tw-justify-center tw-items-center"
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
              onClick={closeLogin}
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
              </div>

              <div className="tw-mt-6 tw-px-4 tw-py-2 tw-rounded tw-bg-black hover:tw-bg-gray-900 tw-text-white tw-font-semibold tw-text-center tw-cursor-pointer" onClick={e=>{
                const email = document.getElementById('login-email')
                const password = document.getElementById('login-password')

                if(!email.value.match("^[\\w-\\.+]*[\\w-\\.]\\@([\\w]+\\.)+[\\w]+[\\w]$")){
                  //not email
                  if(email.value.match(/^[0-9]{10}$/g)){
                    alert('mobile')
                  }
                }
              }}>
                Log in
              </div>
            </div>
            <div className="tw-mt-4 tw-text-sm tw-text-center tw-font-medium tw-text-black hover:tw-underline tw-cursor-pointer">
              Forgot your password?
            </div>

            <hr className="tw-w-52 tw-mx-auto tw-my-3"/>

            <div className="tw-text-sm tw-text-center tw-text-black tw-font-bold">
              Don't have an account?
            </div>


            <div className=" tw-text-sm tw-text-center tw-font-medium tw-text-black hover:tw-underline tw-cursor-pointer">
              Sign up
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
