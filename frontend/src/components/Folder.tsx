import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

type FolderCardProps = {
  name: string;
  color?: string;
  createdAt: Date | string;
  onEdit: () => void;
  onRemove: () => void;
  onClick?: () => void;
};

const FOLDER_COLORS = [
  "#F97316", // orange
  "#8B5CF6", // purple
  "#06B6D4", // cyan
  "#10B981", // emerald
  "#F43F5E", // rose
  "#3B82F6", // blue
  "#EAB308", // yellow
];

function getColorForName(name: string): string {
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return FOLDER_COLORS[Math.abs(hash) % FOLDER_COLORS.length];
}

function formatDate(raw: Date | string): string {
  const d = new Date(raw as string);

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const FolderCard: React.FC<FolderCardProps> = ({
  name,
  color,
  createdAt,
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
      style={{ minHeight: 180 }}
    >
      {/* Smaller top folder section */}
      <div
        className="flex items-center justify-center"
        style={{
          background: resolvedColor,
          flex: "0 0 50%",
          minHeight: 90,
        }}
      >
        {/* Folder icon */}
        <div
          className="flex flex-col items-start gap-0"
          style={{ opacity: 0.22 }}
        >
          <div
            style={{
              width: 40,
              height: 8,
              background: "#fff",
              borderRadius: "6px 6px 0 0",
              marginLeft: 4,
            }}
          />

          <div
            style={{
              width: 72,
              height: 48,
              background: "#fff",
              borderRadius: "0 8px 8px 8px",
            }}
          />
        </div>
      </div>

      {/* Bottom info section */}
      <div
        className="flex flex-col justify-between px-3 py-2.5"
        style={{
          flex: "0 0 50%",
          background: "#13131F",
          borderTop: `2px solid ${resolvedColor}22`,
        }}
      >
        <div>
          <p className="text-[#EAEAF5] text-sm font-semibold truncate leading-tight">
            {name}
          </p>

          <p className="text-[10px] text-white/30 mt-1">
            {formatDate(createdAt)}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="
              flex items-center gap-1 px-2 py-1 rounded-md text-[11px]
              text-white/35 hover:text-[#F97316]
              hover:bg-[#F97316]/10 transition
            "
            aria-label="Edit"
          >
            <Pencil size={11} />
            <span>Edit</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="
              flex items-center gap-1 px-2 py-1 rounded-md text-[11px]
              text-white/35 hover:text-red-400
              hover:bg-red-500/10 transition
            "
            aria-label="Delete"
          >
            <Trash2 size={11} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FolderCard;
