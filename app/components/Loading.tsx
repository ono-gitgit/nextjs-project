export default function Loading() {
  return (
    <div className="w-screen h-screen flex items-center justify-center text-center bg-[rgba(179,179,179,0.5)]">
      <div className="flex justify-center items-center gap-2 mb-5">
        <div className="w-4 h-20 bg-[#3498db] animate-[slide_0.98s_ease-in-out_infinite]"></div>
        <div className="w-4 h-20 bg-[#3498db] animate-[slide_1.08s_ease-in-out_infinite]"></div>
        <div className="w-4 h-20 bg-[#3498db] animate-[slide_1.2s_ease-in-out_infinite]"></div>
      </div>
      <div className="text-[16px] text-[#666] mt-[10px] text-center"></div>
      <style jsx>{`
        @keyframes slide {
          0%,
          40%,
          100% {
            transform: scaleY(0.2);
          }
          20% {
            transform: scaleY(1.5);
          }
        }
      `}</style>
    </div>
  );
}
