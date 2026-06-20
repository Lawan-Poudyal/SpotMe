import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

type FolderCardProps = {
  name: string;
  color?: string;
  createdAt: Date | string;
  numberOfImages?: number;

  onEdit: () => void;
  onRemove: () => void;
  onClick?: () => void;
};

const FOLDER_COLORS = [
  "#F97316",
  "#8B5CF6",
  "#06B6D4",
  "#10B981",
  "#F43F5E",
  "#3B82F6",
  "#EAB308",
];

function getColorForName(name: string): string {
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return FOLDER_COLORS[Math.abs(hash) % FOLDER_COLORS.length];
}

function formatDate(raw: Date | string): string {
  const d = new Date(raw);

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const FolderCard: React.FC<FolderCardProps> = ({
  name,
  color,
  createdAt,
  numberOfImages = 0,
  onEdit,
  onRemove,
  onClick,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const resolvedColor = color ?? getColorForName(name);

  return (
    <div
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        relative flex flex-col rounded-2xl overflow-hidden
        border border-white/[0.07] cursor-pointer
        transition-all duration-150
        hover:border-white/20 hover:scale-[1.02]
        ${isPressed ? "scale-95" : "scale-100"}
      `}
      style={{ minHeight: 220 }}
    >
      {/* Color banner */}
      <div
        style={{
          background: resolvedColor,
          height: 110,
        }}
      />

      {/* Content */}
      <div
        className="flex flex-col justify-between flex-1 px-4 py-3"
        style={{
          background: "#13131F",
        }}
      >
        <div>
          <h3 className="text-white font-semibold text-xl truncate">
            {name}
          </h3>

          <p className="text-white/50 text-sm mt-1">
            {formatDate(createdAt)} •{" "}
            {numberOfImages.toLocaleString()} photos
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="
              flex items-center gap-1
              px-2 py-1 rounded-md
              text-white/40
              hover:text-[#F97316]
              hover:bg-[#F97316]/10
              transition
            "
          >
            <Pencil size={14} />
            Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="
              flex items-center gap-1
              px-2 py-1 rounded-md
              text-white/40
              hover:text-red-400
              hover:bg-red-500/10
              transition
            "
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default FolderCard;