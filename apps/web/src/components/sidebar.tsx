import { Button } from "./ui/button";
import Link from "next/link";
import React from "react";

export const Sidebar = () => {
  return (
    <div className='flex w-[254px] flex-col gap-2'>
      <Link href={`/${crypto.randomUUID()}`} className='ml-auto'>
        <Button variant='ghost' size='icon'>
          <svg
            width='17'
            height='17'
            viewBox='0 0 17 17'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M7.0525 0.708008L8.50016 0.708008C8.89137 0.708008 9.2085 1.02514 9.2085 1.41634C9.2085 1.80754 8.89137 2.12467 8.50016 2.12467H7.0835C6.08005 2.12467 5.37006 2.12523 4.81502 2.17057C4.26824 2.21525 3.93449 2.29984 3.67219 2.43349C3.13906 2.70513 2.70562 3.13858 2.43398 3.6717C2.30033 3.93401 2.21574 4.26775 2.17106 4.81453C2.12571 5.36957 2.12516 6.07956 2.12516 7.08301V9.91634C2.12516 10.9198 2.12571 11.6298 2.17106 12.1848C2.21574 12.7316 2.30033 13.0653 2.43398 13.3276C2.70562 13.8608 3.13906 14.2942 3.67219 14.5659C3.93449 14.6995 4.26824 14.7841 4.81502 14.8288C5.37006 14.8741 6.08005 14.8747 7.0835 14.8747H9.91683C10.9203 14.8747 11.6303 14.8741 12.1853 14.8288C12.7321 14.7841 13.0658 14.6995 13.3281 14.5659C13.8613 14.2942 14.2947 13.8608 14.5663 13.3276C14.7 13.0653 14.7846 12.7316 14.8293 12.1848C14.8746 11.6298 14.8752 10.9198 14.8752 9.91634V8.49967C14.8752 8.10847 15.1923 7.79134 15.5835 7.79134C15.9747 7.79134 16.2918 8.10847 16.2918 8.49967V9.94735C16.2918 10.9128 16.2918 11.6807 16.2412 12.3002C16.1894 12.9346 16.081 13.4755 15.8286 13.9708C15.4211 14.7705 14.771 15.4207 13.9713 15.8281C13.476 16.0805 12.9351 16.1889 12.3007 16.2407C11.6812 16.2914 10.9133 16.2913 9.94784 16.2913H7.05248C6.087 16.2913 5.31915 16.2914 4.69966 16.2407C4.06527 16.1889 3.52434 16.0805 3.02904 15.8281C2.22935 15.4207 1.57918 14.7705 1.17172 13.9708C0.919351 13.4755 0.810932 12.9346 0.759101 12.3002C0.708486 11.6807 0.70849 10.9128 0.708496 9.94734V7.05201C0.70849 6.08652 0.708486 5.31867 0.759101 4.69917C0.810932 4.06478 0.919351 3.52385 1.17172 3.02855C1.57918 2.22886 2.22935 1.57869 3.02904 1.17123C3.52434 0.918862 4.06527 0.810444 4.69966 0.758613C5.31916 0.707998 6.08701 0.708002 7.0525 0.708008ZM13.9349 2.89566C13.6648 2.65008 13.2522 2.65008 12.9821 2.89566C12.9727 2.90415 12.9591 2.91751 12.8969 2.97971L12.7318 3.14482C12.754 3.75226 13.2476 4.24582 13.855 4.26808L14.0201 4.10297C14.0823 4.04078 14.0957 4.02713 14.1042 4.01779C14.3498 3.74762 14.3498 3.33506 14.1042 3.0649C14.0957 3.05556 14.0823 3.0419 14.0201 2.97971C13.9579 2.91751 13.9443 2.90415 13.9349 2.89566ZM15.0116 1.96773C14.9654 1.92149 14.9257 1.88176 14.8878 1.84735C14.0773 1.11063 12.8397 1.11063 12.0292 1.84735C11.9913 1.88176 11.9516 1.92151 11.9053 1.96776L11.546 2.32707C11.5424 2.33067 11.5387 2.3343 11.5351 2.33798L8.88718 4.98592C8.87432 4.99878 8.86163 5.01147 8.8491 5.02399C8.55502 5.31796 8.3513 5.5216 8.18282 5.75596C8.03372 5.96338 7.9075 6.18632 7.80635 6.42089C7.69206 6.68593 7.62226 6.96539 7.52149 7.36881C7.5172 7.386 7.51285 7.40341 7.50844 7.42105L7.10465 9.03621C7.0443 9.27759 7.11503 9.53294 7.29096 9.70888C7.4669 9.88481 7.72224 9.95554 7.96363 9.89519L9.57879 9.4914C9.59643 9.48699 9.61384 9.48264 9.63102 9.47835C10.0344 9.37758 10.3139 9.30777 10.579 9.19349C10.8135 9.09234 11.0365 8.96612 11.2439 8.81701C11.4782 8.64854 11.6819 8.44482 11.9758 8.15074C11.9884 8.13821 12.0011 8.12552 12.0139 8.11266L14.6619 5.46469C14.6655 5.46111 14.6692 5.45749 14.6727 5.45383L15.0321 5.09452C15.0783 5.04827 15.1181 5.00854 15.1525 4.97068C15.8892 4.16019 15.8892 2.9225 15.1525 2.112C15.1181 2.07415 15.0783 2.03443 15.0321 1.9882L15.0116 1.96773ZM12.7213 5.40178C12.2403 5.15408 11.8458 4.75949 11.5981 4.27852L9.88892 5.98766C9.5427 6.33387 9.42618 6.45341 9.33312 6.58286C9.24366 6.70731 9.16792 6.84108 9.10723 6.98182C9.04411 7.12822 9.00156 7.28963 8.88281 7.76464L8.76534 8.2345L9.2352 8.11703C9.7102 7.99828 9.87162 7.95573 10.018 7.8926C10.1588 7.83192 10.2925 7.75618 10.417 7.66672C10.5464 7.57366 10.666 7.45714 11.0122 7.11092L12.7213 5.40178Z'
              fill='currentColor'
            />
          </svg>
          <span className='sr-only'>New note</span>
        </Button>
      </Link>

      <Link href='/'>
        <Button variant='ghost' className='justify-start'>
          Home
        </Button>
      </Link>
    </div>
  );
};
