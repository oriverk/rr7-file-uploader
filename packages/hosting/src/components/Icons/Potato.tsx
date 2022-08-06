import type { FC } from 'react';

interface Props {
  className?: string;
}

export const Potato: FC<Props> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 512.423 512.423" xmlns="http://www.w3.org/2000/svg">
    <path d="M235.596 139.018C165.304 186.747-.445 153.771 9.101 289.147c8.678 112.814 177.898 136.244 263.81 131.037 347.987-18.223 249.925-475.552-37.315-281.166" fill="#fd9808"/>
    <path d="M224.314 144.225C156.626 191.954-.445 162.449 6.497 296.957c6.075 111.078 166.617 131.905 248.19 125.831 332.366-23.431 245.587-476.421-30.373-278.563" fill="#ffdd09" />
    <path d="M38.606 296.957c-7.81-134.508 150.129-105.003 216.949-152.732 42.522-30.373 80.705-45.993 113.681-49.464-38.183-4.339-86.78 8.678-142.319 49.464C159.23 191.954 2.159 162.449 9.101 296.957c5.207 105.871 151.864 130.169 236.041 126.698-85.045-2.603-202.197-32.108-206.536-126.698" fill="#fff" />
    <path d="M250.348 429.73C146.212 429.73 8.233 394.15.423 290.015c-6.942-98.061 72.895-115.417 143.186-129.302 33.844-6.942 65.953-13.885 87.647-28.637 81.573-55.539 160.542-65.085 215.214-24.298 49.464 36.447 69.424 107.607 49.464 173.559-26.034 86.78-109.342 141.451-223.024 147.525-6.941.868-14.751.868-22.562.868zM367.501 99.967c-38.183 0-81.573 15.62-127.566 45.993-23.43 17.356-57.275 24.298-92.854 31.241-69.424 14.753-134.509 28.638-129.302 111.946 6.942 98.929 159.675 128.434 254.264 123.227 106.739-5.207 183.973-56.407 207.403-135.376 17.356-59.878 0-123.227-43.39-155.336-19.091-14.752-42.521-21.695-68.555-21.695zm-131.905 39.051z" />
    <path d="M434.321 429.73H87.203c-5.207 0-8.678-3.471-8.678-8.678 0-5.207 3.471-8.678 8.678-8.678h347.119c5.207 0 8.678 3.471 8.678 8.678-.001 5.207-3.472 8.678-8.679 8.678zM43.813 429.73H26.457c-5.207 0-8.678-3.471-8.678-8.678 0-5.207 3.471-8.678 8.678-8.678h17.356c5.207 0 8.678 3.471 8.678 8.678 0 5.207-3.471 8.678-8.678 8.678zM503.745 429.73h-34.712c-5.207 0-8.678-3.471-8.678-8.678 0-5.207 3.471-8.678 8.678-8.678h34.712c5.207 0 8.678 3.471 8.678 8.678 0 5.207-3.471 8.678-8.678 8.678zM104.559 403.696c-5.207 0-8.678-3.471-8.678-8.678V342.95c0-5.207 3.471-8.678 8.678-8.678 5.207 0 8.678 3.471 8.678 8.678v52.068c-.001 5.207-3.472 8.678-8.678 8.678zM104.559 316.917c-5.207 0-8.678-3.471-8.678-8.678v-8.678c0-5.207 3.471-8.678 8.678-8.678 5.207 0 8.678 3.471 8.678 8.678v8.678c-.001 5.206-3.472 8.678-8.678 8.678zM52.491 368.984c-5.207 0-8.678-3.471-8.678-8.678v-52.068c0-5.207 3.471-8.678 8.678-8.678s8.678 3.471 8.678 8.678v52.068c0 5.207-3.472 8.678-8.678 8.678zM78.525 221.459c-5.207 0-8.678-3.471-8.678-8.678v-26.034c0-5.207 3.471-8.678 8.678-8.678 5.207 0 8.678 3.471 8.678 8.678v26.034c0 5.207-3.472 8.678-8.678 8.678zM147.948 368.984c-5.207 0-8.678-3.471-8.678-8.678V342.95c0-5.207 3.471-8.678 8.678-8.678s8.678 3.471 8.678 8.678v17.356c0 5.207-3.471 8.678-8.678 8.678zM191.338 351.628c-5.207 0-8.678-3.471-8.678-8.678v-43.39c0-5.207 3.471-8.678 8.678-8.678 5.207 0 8.678 3.471 8.678 8.678v43.39c0 5.207-3.471 8.678-8.678 8.678zM191.338 212.781c-5.207 0-8.678-3.471-8.678-8.678v-43.39c0-5.207 3.471-8.678 8.678-8.678 5.207 0 8.678 3.471 8.678 8.678v43.39c0 5.207-3.471 8.678-8.678 8.678zM295.474 256.171c-5.207 0-8.678-3.471-8.678-8.678v-17.356c0-5.207 3.471-8.678 8.678-8.678 5.207 0 8.678 3.471 8.678 8.678v17.356c0 5.207-3.471 8.678-8.678 8.678zM295.474 360.306c-5.207 0-8.678-3.471-8.678-8.678v-69.424c0-5.207 3.471-8.678 8.678-8.678 5.207 0 8.678 3.471 8.678 8.678v69.424c0 5.207-3.471 8.678-8.678 8.678zM416.965 152.035c-5.207 0-8.678-3.471-8.678-8.678v-34.712c0-5.207 3.471-8.678 8.678-8.678 5.207 0 8.678 3.471 8.678 8.678v34.712c0 5.207-3.471 8.678-8.678 8.678zM416.965 377.662c-5.207 0-8.678-3.471-8.678-8.678v-34.712c0-5.207 3.471-8.678 8.678-8.678 5.207 0 8.678 3.471 8.678 8.678v34.712c0 5.207-3.471 8.678-8.678 8.678zM469.033 230.137c-5.207 0-8.678-3.471-8.678-8.678v-8.678c0-5.207 3.471-8.678 8.678-8.678 5.207 0 8.678 3.471 8.678 8.678v8.678c0 5.207-3.471 8.678-8.678 8.678zM469.033 186.747c-5.207 0-8.678-3.471-8.678-8.678v-34.712c0-5.207 3.471-8.678 8.678-8.678 5.207 0 8.678 3.471 8.678 8.678v34.712c0 5.207-3.471 8.678-8.678 8.678zM338.864 152.035c-5.207 0-8.678-3.471-8.678-8.678v-43.39c0-5.207 3.471-8.678 8.678-8.678 5.207 0 8.678 3.471 8.678 8.678v43.39c0 5.207-3.472 8.678-8.678 8.678zM356.22 412.374c-5.207 0-8.678-3.471-8.678-8.678v-43.39c0-5.207 3.471-8.678 8.678-8.678 5.207 0 8.678 3.471 8.678 8.678v43.39c-.001 5.207-3.472 8.678-8.678 8.678z" />
    <path d="M260.762 429.73c-5.207 0-8.678-3.471-8.678-8.678V386.34c0-5.207 3.471-8.678 8.678-8.678 5.207 0 8.678 3.471 8.678 8.678v34.712c0 5.207-3.471 8.678-8.678 8.678z" />
  </svg>
);
