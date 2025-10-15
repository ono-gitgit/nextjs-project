"use client";
import React from "react";

type Prop = {
  budget: number;
  expenditure: number;
};

export default function BudgetBar({ budget, expenditure }: Prop) {
  const getColor = (expenditure: number) => {
    if ((budget - expenditure) / budget < 0.05) return "bg-[#9A6229]";
    if ((budget - expenditure) / budget < 0.1) return "bg-[#C0C0C0]";
    if ((budget - expenditure) / budget < 0.2) return "bg-[#D3AF37]";
    if ((budget - expenditure) / budget < 0.3)
      return "bg-linear-to-r from-gray-600 via-gray-400 to-gray-700";
    return "bg-linear-to-r from-blue-400 via-blue-300 to-blue-600";
  };

  return (
    <div className="w-[130px] absolute right-3 bottom-8 bg-gray-300 rounded-full h-3 overflow-hidden shadow-inner">
      <div
        className={`h-full ${getColor(
          expenditure
        )} transition-all duration-500`}
        style={{
          width:
            budget - expenditure > 0
              ? `${(130 * (budget - expenditure)) / budget}px`
              : "0px",
        }}
      />
    </div>
  );
}
