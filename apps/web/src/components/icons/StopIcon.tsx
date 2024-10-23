import React from "react";

interface StopIconProps {
  className?: string;
}

const StopIcon: React.FC<StopIconProps> = ({ className }) => {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M10.85 1.25C7.48969 1.25 5.80953 1.25 4.52606 1.90396C3.39708 2.4792 2.4792 3.39708 1.90396 4.52606C1.25 5.80953 1.25 7.48968 1.25 10.85V13.15C1.25 16.5103 1.25 18.1905 1.90396 19.4739C2.4792 20.6029 3.39708 21.5208 4.52606 22.096C5.80953 22.75 7.48968 22.75 10.85 22.75H13.15C16.5103 22.75 18.1905 22.75 19.4739 22.096C20.6029 21.5208 21.5208 20.6029 22.096 19.4739C22.75 18.1905 22.75 16.5103 22.75 13.15V10.85C22.75 7.48969 22.75 5.80953 22.096 4.52606C21.5208 3.39708 20.6029 2.4792 19.4739 1.90396C18.1905 1.25 16.5103 1.25 13.15 1.25H10.85Z'
        fill='currentColor'
        fillOpacity='0.92'
      />
    </svg>
  );
};

export default StopIcon;
