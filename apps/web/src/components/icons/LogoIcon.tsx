import React from "react";

interface LogoIconProps {
  className?: string;
}

export const LogoIcon: React.FC<LogoIconProps> = ({ className }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 47 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g filter="url(#filter0_f_18153_3340)">
        <path
          d="M42.2985 22.5965C42.2985 32.5909 34.1964 40.693 24.202 40.693C14.2075 40.693 6.10547 32.5909 6.10547 22.5965C6.10547 12.6021 14.2075 4.5 24.202 4.5C34.1964 4.5 42.2985 12.6021 42.2985 22.5965Z"
          stroke="currentColor"
        />
        <path
          d="M40.8951 23.9998C40.8951 33.9942 32.7931 42.0963 22.7986 42.0963C12.8042 42.0963 4.70215 33.9942 4.70215 23.9998C4.70215 14.0054 12.8042 5.90332 22.7986 5.90332C32.7931 5.90332 40.8951 14.0054 40.8951 23.9998Z"
          stroke="currentColor"
        />
        <circle cx="23.5004" cy="24.7016" r="18.7982" stroke="currentColor" />
      </g>
      <path
        d="M42.2985 22.5965C42.2985 32.5909 34.1964 40.693 24.202 40.693C14.2075 40.693 6.10547 32.5909 6.10547 22.5965C6.10547 12.6021 14.2075 4.5 24.202 4.5C34.1964 4.5 42.2985 12.6021 42.2985 22.5965Z"
        stroke="currentColor"
      />
      <path
        d="M40.8951 23.9998C40.8951 33.9942 32.7931 42.0963 22.7986 42.0963C12.8042 42.0963 4.70215 33.9942 4.70215 23.9998C4.70215 14.0054 12.8042 5.90332 22.7986 5.90332C32.7931 5.90332 40.8951 14.0054 40.8951 23.9998Z"
        stroke="currentColor"
      />
      <circle cx="23.5004" cy="24.7016" r="18.7982" stroke="currentColor" />
      <defs>
        <filter
          id="filter0_f_18153_3340"
          x="0.202148"
          y="0"
          width="46.5967"
          height="48"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_18153_3340" />
        </filter>
      </defs>
    </svg>
  );
};
