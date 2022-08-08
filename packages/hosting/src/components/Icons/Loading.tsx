import { FC } from "react";

import "../../styles/loading.css";

export const Loading: FC = () => (
  <div className="sk-cube-grid">
    {[...Array(9)].map((_val, i) => {
      const className = `sk-cube${i + 1}`;
      return <div className={`sk-cube ${className} bg-[#333] dark:bg-gray-200`} key={className} />;
    })}
  </div>
);
