import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

type FolderCardProps = {
  name: string;
  color?: string;
  createdAt: Date | string;
  numberOfImages?: number;
  thumbNailUrl?: string;

  onEdit: () => void;
  onRemove: () => void;
  onClick?: () => void;
};

const FOLDER_COLORS = ['#E8572A', '#8B5CF6', '#06B6D4', '#10B981', '#F43F5E', '#3B82F6', '#EAB308'];

function getColorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return FOLDER_COLORS[Math.abs(hash) % FOLDER_COLORS.length];
}

function formatDate(raw: Date | string): string {
  const d = new Date(raw);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

const FolderCard: React.FC<FolderCardProps> = ({
  name,
  color,
  createdAt,
  numberOfImages = 0,
  thumbNailUrl,
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
        bg-[#111111] border border-[#2a2a2a] cursor-pointer
        transition-all duration-200 ease-out shadow-lg
        hover:border-[#E8572A]/40 hover:shadow-2xl
        ${isPressed ? 'scale-[0.98]' : 'hover:scale-[1.01]'}
      `}
      style={{ minHeight: 220 }}
    >
      {/* Color banner */}
      {/* Color banner / Thumbnail */}
      {thumbNailUrl ? (
        <img
          src={thumbNailUrl}
          alt={name}
          className="w-full object-cover"
          style={{ height: 100 }}
        />
      ) : (
        <div
          style={{
            background: resolvedColor,
            height: 100,
          }}
        />
      )}

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 p-5 gap-3 bg-[#111111]">
        <div>
          <h3 className="text-white font-semibold text-lg truncate">{name}</h3>

          <p className="text-[#888888] text-sm mt-1">
            {formatDate(createdAt)} • {numberOfImages.toLocaleString()} photos
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-2">
          {/* Edit Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="
              flex items-center gap-1.5
              px-3 py-1.5 rounded-lg text-sm
              text-[#555555] font-medium
              hover:text-white hover:bg-[#2a2a2a]
              transition-colors duration-200
            "
          >
            <Pencil size={14} />
            Edit
          </button>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="
              flex items-center gap-1.5
              px-3 py-1.5 rounded-lg text-sm
              text-[#555555] font-medium
              hover:text-red-400 hover:bg-red-500/10
              transition-colors duration-200
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

