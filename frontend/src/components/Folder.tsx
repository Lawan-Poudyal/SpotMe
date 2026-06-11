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
  color = "#60a5fa",
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
      className={`relative flex items-center justify-between gap-3 p-4 rounded-xl border 
        bg-white shadow-sm cursor-pointer transition-all duration-150
        hover:shadow-md hover:-translate-y-0.5
        ${isPressed ? "scale-95" : "scale-100"}`}
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        <Folder size={28} color={color} fill={color} />
        <span className="font-medium text-gray-800">{name}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-2 rounded-md hover:bg-gray-100 transition"
        >
          <Pencil size={18} className="text-gray-600" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-2 rounded-md hover:bg-red-100 transition"
        >
          <Trash2 size={18} className="text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default FolderCard;
