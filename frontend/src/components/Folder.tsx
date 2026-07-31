import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

type FolderCardProps = {
  name: string;
  color?: string;
  createdAt: Date | string;
  numberOfImages?: number;
  thumbNailUrl?: string;

  onEdit?: () => void;
  onRemove?: () => void;
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

const optimizedImageUrl = (url: string, width = 400) =>
  url.includes('res.cloudinary.com')
    ? url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_fill/`)
    : url;

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
         hover:shadow-2xl
      `}
      style={{ minHeight: 220 }}
    >
      {thumbNailUrl ? (
        <img
          src={optimizedImageUrl(thumbNailUrl, 400)}
          alt={name}
          className="w-full object-cover"
          style={{ height: 100 }}
          loading="lazy"
        />
      ) : (
        <div
          style={{
            background: resolvedColor,
            height: 100,
          }}
        />
      )}
      <div className="flex flex-col justify-between flex-1 p-5 gap-3 bg-[#111111]">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-white font-semibold text-lg truncate">{name}</h3>
            {(!onEdit || !onRemove) && (
              <span className="text-[10px] font-semibold bg-white/5 text-white/60 border border-white/10 px-2 py-0.5 rounded-full shrink-0">
                Joined
              </span>
            )}
          </div>
          <p className="text-[#888888] text-sm mt-1">
            {formatDate(createdAt)} • {numberOfImages.toLocaleString()} photos
          </p>
        </div>
        <div className="flex gap-2 mt-2">
          {onEdit && (
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
          )}
          {onRemove && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderCard;
