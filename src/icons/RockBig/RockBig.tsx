/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";

interface Props {
  className: any;
}

export const RockBig = ({ className }: Props): JSX.Element => {
  return (
    <svg
      className={`${className}`}
      fill="none"
      height="56"
      viewBox="0 0 55 56"
      width="55"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M48.6729 18.5223L34.5898 10.4786L9.85953 17.2287L4.65369 43.2856L34.6632 32.724L48.6729 18.5223Z"
        fill="white"
      />
      <path d="M48.2492 24.7233L38.4825 34.6239L42.3871 39.527L48.2492 24.7233Z" fill="white" />
      <path d="M40.2415 43.3391L35.0902 36.8706L12.3131 44.8869L40.2415 43.3391Z" fill="white" />
    </svg>
  );
};
