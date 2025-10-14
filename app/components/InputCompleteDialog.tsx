"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";

type Prop = {
  isDialogOpen: boolean;
  dialogMessage: string;
  onClick: () => void;
};

export default function InputCompleteDialog({
  isDialogOpen,
  dialogMessage,
  onClick,
}: Prop) {
  return (
    <Dialog open={isDialogOpen}>
      <DialogTitle>
        <p>{dialogMessage}！</p>
      </DialogTitle>
      <DialogActions>
        <button
          onClick={() => {
            onClick();
          }}
          className="text-3xl text-blue-500 w-20"
        >
          OK
        </button>
      </DialogActions>
    </Dialog>
  );
}
