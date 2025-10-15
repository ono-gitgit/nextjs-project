"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

type Prop = {
  isDialogOpen: boolean;
  title?: string;
  explain: string;
  onClick: () => void;
};

export default function ExplainDialog({
  isDialogOpen,
  title,
  explain,
  onClick,
}: Prop) {
  return (
    <Dialog open={isDialogOpen}>
      <DialogTitle>
        <p>{title}</p>
      </DialogTitle>
      <DialogContent>
        <p className="mb-5">{explain}</p>
      </DialogContent>
      <DialogActions>
        <button
          onClick={() => {
            onClick();
          }}
          className="bg-gray-200 shadow-xl/20 text-3xl rounded-2xl text-blue-500 w-20"
        >
          OK
        </button>
      </DialogActions>
    </Dialog>
  );
}
