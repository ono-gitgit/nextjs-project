"use client";
import { useRouter } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import AssistantPhotoIcon from "@mui/icons-material/AssistantPhoto";
import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

export const BottomNavigation = () => {
  const [navigation, setNavigation] = useState<string | null>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const navigation = sessionStorage.getItem("navigation");
    setNavigation(navigation);
  }, []);
  return (
    <>
      {navigation !== null && (
        <ul className="flex flex-row bg-[#FAFAFA] justify-center items-center fixed bottom-0 w-screen h-12 z-10">
          <li>
            <button
              onClick={() => {
                sessionStorage.setItem("navigation", "home");
                router.push("/home");
              }}
              className={`flex flex-col items-center justify-center hover:bg-gray-200 rounded-2xl w-[25vw] h-12 ${
                navigation === "home" && "text-[#FF6624]"
              }`}
            >
              <HomeIcon />
              ホーム
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                sessionStorage.setItem("navigation", "goalSetting");
                router.push("/goalSetting");
              }}
              className={`flex flex-col items-center justify-center hover:bg-gray-200 rounded-2xl w-[25vw] h-12 ${
                navigation === "goalSetting" && "text-[#FF6624]"
              }`}
            >
              <AssistantPhotoIcon />
              目標設定
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                sessionStorage.setItem("navigation", "record");
                router.push("/record");
              }}
              className={`flex flex-col items-center justify-center hover:bg-gray-200 rounded-2xl w-[25vw] h-12 ${
                navigation === "record" && "text-[#FF6624]"
              }`}
            >
              <EditIcon />
              記録
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setIsDialogOpen(true);
              }}
              className={`flex flex-col items-center justify-center hover:bg-gray-200 rounded-2xl w-[25vw] h-12 ${
                navigation === "others" && "text-[#FF6624]"
              }`}
            >
              <MoreHorizIcon />
              その他
            </button>
          </li>
        </ul>
      )}
      <ShowOthersDialog
        isOpen={isDialogOpen}
        handleClose={() => {
          setIsDialogOpen(false);
        }}
      />
    </>
  );
};

type Prop = {
  isOpen: boolean;
  handleClose: () => void;
};
const ShowOthersDialog: React.FC<Prop> = ({ isOpen, handleClose }) => {
  const router = useRouter();
  const className =
    "flex flex-col items-center justify-center hover:bg-gray-200 rounded-2xl w-[200px] h-10";
  return (
    <Dialog open={isOpen} onClose={handleClose} className="">
      <DialogContent>
        <ul>
          <li>
            <button
              onClick={() => {
                router.push("/editAccount");
                sessionStorage.setItem("navigation", "others");
              }}
              className={className}
            >
              アカウント編集
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                router.push("/inquiry");
                sessionStorage.setItem("navigation", "others");
              }}
              className={className}
            >
              お問い合わせ
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                router.push("/cancellation");
                sessionStorage.setItem("navigation", "others");
              }}
              className={`text-red-500 ${className}`}
            >
              退会する
            </button>
          </li>
        </ul>
      </DialogContent>
    </Dialog>
  );
};
