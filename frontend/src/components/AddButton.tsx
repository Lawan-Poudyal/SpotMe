import { Plus } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

type addButtonPropType = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const AddButton = ({ setOpen }: addButtonPropType) => {
  return (
    <button
      onClick={() => setOpen(true)}
      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20
        text-sm font-semibold text-white bg-transparent
        hover:bg-white/[0.06] active:scale-95 transition-all duration-150"
    >
      <Plus size={15} />
      New event
    </button>
  );
};

export default AddButton;