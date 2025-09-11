import React from "react";

type Prop = {
  children: React.ReactNode;
};

export const BackgroundColor: React.FC<Prop> = ({ children }) => {
  return (
    <div className="max-w-full bg-linear-to-t from-[#A9E688] to-[#CEE6C1] font-sans grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen pb-20 gap-16 ">
      {children}
    </div>
  );
};
