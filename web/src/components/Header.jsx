import React from "react";
import { useNavigate } from "react-router-dom";

import "./header.css";
export default function Header() {
  let navigate = useNavigate();
  return (
    <header className="tw-text-gray-800">
      <ul className="tw-flex tw-justify-between tw-items-center">
        <li className="tw-mx-4 tw-my-2">
          <div
            class="hamburger"
            id="hamburger-1"
            onClick={(e) => {
              document
                .getElementById("hamburger-1")
                .classList.toggle("is-active");
            }}
          >
            <span class="line"></span>
            <span class="line"></span>
            <span class="line"></span>
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
        <li className="tw-mx-4 tw-cursor-pointer">Login</li>
      </ul>
      <div
        className="tw-backdrop-blur-md tw-absolute tw-inset-0 tw-flex tw-justify-center tw-items-center"
        id="login-modal"
      >
        <div className="tw-bg-slate-50 tw-p-4 tw-max-w-sm tw-rounded tw-shadow-md tw-text-gray-800">
          {/* modal header */}
          <div className="tw-flex tw-justify-between tw-items-center tw-mb-3">
            <h4 className="tw-font-semibold tw-text-xl">Welcome to RàsBérry</h4>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="tw-w-6 tw-h-6 tw-cursor-pointer"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          {/* modal body */}
          <div className="">
            <p>Please enter your details,</p>
            <div className="tw-w-100 tw-m-1 tw-cursor-pointer tw-text-center tw-p-2 tw-bg-white tw-rounded">Login with Google</div>
            <p className="tw-text-center">-or-</p>
            <label>Email</label>
            <input type="text"/>
          </div>
        </div>
      </div>
    </header>
  );
}
