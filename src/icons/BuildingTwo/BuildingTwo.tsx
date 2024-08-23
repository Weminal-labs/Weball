/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";

interface Props {
  className: any;
}

export const BuildingTwo = ({ className }: Props): JSX.Element => {
  return (
    <svg
      className={`${className}`}
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6.5 14H2V4L3 3H9L10 4V5" stroke="white" strokeWidth="1.5" />
      <path d="M8 14V8L11 6.5L14 8V14H12.5H9.5H8Z" fill="white" />
      <rect fill="white" height="2" width="2" x="4" y="6" />
      <rect fill="white" height="2" width="2" x="4" y="9" />
    </svg>
  );
};
