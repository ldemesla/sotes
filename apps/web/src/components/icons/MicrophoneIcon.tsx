import React from "react";

interface MicrophoneIconProps {
  className?: string;
}

export const MicrophoneIcon: React.FC<MicrophoneIconProps> = ({
  className,
}) => {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M12 1C8.96243 1 6.5 3.46243 6.5 6.5V11C6.5 14.0376 8.96243 16.5 12 16.5C15.0376 16.5 17.5 14.0376 17.5 11V6.5C17.5 3.46243 15.0376 1 12 1ZM5 11C5 10.4477 4.55228 10 4 10C3.44772 10 3 10.4477 3 11C3 13.8301 4.30086 16.092 6.05578 17.6276C7.50422 18.895 9.29622 19.6992 11 19.9307V22C11 22.5523 11.4477 23 12 23C12.5523 23 13 22.5523 13 22V19.9307C14.7038 19.6992 16.4958 18.895 17.9442 17.6276C19.6991 16.092 21 13.8301 21 11C21 10.4477 20.5523 10 20 10C19.4477 10 19 10.4477 19 11C19 13.1699 18.0151 14.908 16.6272 16.1224C15.2201 17.3537 13.4492 18 12 18C10.5508 18 8.77993 17.3537 7.37279 16.1224C5.98486 14.908 5 13.1699 5 11Z'
        fill='currentColor'
      />
    </svg>
  );
};
