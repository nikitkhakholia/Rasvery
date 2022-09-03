import React, { useEffect, useState } from "react";

export default function AlertSuccess({ children }) {
  // state variables
  const [mounted, setMounted] = useState(true);

  // remove after 7 seconds automatically
  useEffect(() => {
    setTimeout(() => {
      setMounted(false);
    }, 7000);
  }, []);

  return (
    mounted && (
      <div
        className="tw-flex tw-p-4 tw-m-4 tw-bg-green-100 tw-rounded-lg dark:tw-bg-green-200 tw-items-center"
        role="alert"
      >
        <svg
          aria-hidden="true"
          className="tw-flex-shrink-0 tw-w-5 tw-h-5 tw-text-green-700 dark:tw-text-green-800"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          ></path>
        </svg>
        {/* screen reader only */}
        <span className="tw-sr-only">Info</span>
        <div className="tw-mx-3 tw-text-sm tw-font-medium tw-text-green-700 dark:tw-text-green-800">
          {children}
        </div>
        <button
          onClick={(e) => {
            setMounted(false);
          }}
          type="button"
          className="tw-ml-auto tw-bg-green-100 tw-text-green-500 tw-rounded-lg focus:tw-ring-2 focus:tw-ring-green-400 tw-p-1.5 hover:tw-bg-green-200 tw-inline-flex tw-h-8 tw-w-8 dark:tw-bg-green-200 dark:tw-text-green-600 dark:hover:tw-bg-green-300"
        >
          <span className="tw-sr-only">Close</span>
          <svg
            className="tw-w-5 tw-h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    )
  );
}
