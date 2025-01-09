import React from "react";
import { Task } from "@/types/task";

interface TaskPopoverProps {
  task: Task;
  position: { x: number; y: number };
}

export const TaskPopover: React.FC<TaskPopoverProps> = ({ task, position }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className="absolute z-50 bg-white rounded-lg shadow-lg p-4 w-72"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <h3 className="font-bold text-lg mb-2">{task.name}</h3>
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">期間：</span>
          <div className="ml-2">
            {formatDate(task.startDate)} 〜 {formatDate(task.endDate)}
          </div>
        </div>

        {task.bufferBefore > 0 && (
          <div>
            <span className="font-medium">開始バッファー：</span>
            <span className="ml-2">{task.bufferBefore}日</span>
          </div>
        )}

        {task.bufferAfter > 0 && (
          <div>
            <span className="font-medium">終了バッファー：</span>
            <span className="ml-2">{task.bufferAfter}日</span>
          </div>
        )}

        <div className="flex items-center">
          <span className="font-medium">カラー：</span>
          <div
            className="ml-2 w-4 h-4 rounded"
            style={{ backgroundColor: task.color }}
          />
        </div>
      </div>
    </div>
  );
};
