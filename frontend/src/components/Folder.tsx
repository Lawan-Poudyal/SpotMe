import React, { useState } from "react";
import { Folder, Pencil, Trash2 } from "lucide-react";

type FolderCardProps = {
  name: string;
  color?: string;
  onEdit: () => void;
  onRemove: () => void;
  onClick?: () => void;
};

const FolderCard: React.FC<FolderCardProps> = ({
  name,
  color = "#F97316",
  onEdit,
  onRemove,
  onClick,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        relative flex items-center justify-between gap-3 p-4 rounded-xl
        bg-[#1A1A2E] border border-white/[0.07]
        cursor-pointer transition-all duration-150
        hover:bg-[#20203A] hover:border-[#F97316]/25
        ${isPressed ? "scale-95" : "scale-100"}
      `}
    >
      {/* Left side */}
      <div className="flex items-center gap-3 min-w-0">
        <Folder
          size={26}
          color={color}
          fill={color}
          className="shrink-0"
        />
        <span className="font-medium text-[#C8C8E0] text-sm truncate">
          {name}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1.5 rounded-lg hover:bg-[#F97316]/10 transition group"
          aria-label="Edit"
        >
          <Pencil size={15} className="text-white/25 group-hover:text-[#F97316] transition" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1.5 rounded-lg hover:bg-red-500/10 transition group"
          aria-label="Delete"
        >
          <Trash2 size={15} className="text-white/25 group-hover:text-red-500 transition" />
        </button>
      </div>
    </div>
  );
};

export default FolderCard;
