import React from "react";
import Loading from "./Loading";
import { BottomNavigation } from "./BottomNavigation";

type Prop = {
  isLoading: boolean;
  children: React.ReactNode;
};

export const BackgroundColor: React.FC<Prop> = ({ isLoading, children }) => {
  return (
    <div className="bg-linear-to-t from-[#A9E688] to-[#CEE6C1] font-sans min-h-screen bg-cover pb-20 gap-16 relative">
      {children}
      {isLoading && <Loading />}
      <BottomNavigation />
    </div>
  );
};
