/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";

interface Props {
  className: any;
}

export const ShipSurrounded1 = ({ className }: Props): JSX.Element => {
  return (
    <svg
      className={`${className}`}
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 5.5H1V9L4 12V5.5Z" fill="white" />
      <path d="M10.5 4L10.5 1L7 1L4 4L10.5 4Z" fill="white" />
      <path d="M5.5 12L5.5 15L9 15L12 12L5.5 12Z" fill="white" />
      <path d="M12 10.5L15 10.5L15 7L12 4L12 10.5Z" fill="white" />
      <path d="M6 10L8 6L10 10H6Z" fill="white" />
    </svg>
  );
};
