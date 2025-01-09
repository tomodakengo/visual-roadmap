import React, { useState } from "react";
import { Task } from "@/types/task";

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id">) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [taskData, setTaskData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    bufferBefore: 0,
    bufferAfter: 0,
    color: "#4A90E2",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(taskData);
    setTaskData({
      name: "",
      startDate: "",
      endDate: "",
      bufferBefore: 0,
      bufferAfter: 0,
      color: "#4A90E2",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 mb-6 p-4 border rounded-lg bg-white shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">タスク名</label>
          <input
            type="text"
            value={taskData.name}
            onChange={(e) => setTaskData({ ...taskData, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">色</label>
          <input
            type="color"
            value={taskData.color}
            onChange={(e) =>
              setTaskData({ ...taskData, color: e.target.value })
            }
            className="h-10 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">開始日</label>
          <input
            type="date"
            value={taskData.startDate}
            onChange={(e) =>
              setTaskData({ ...taskData, startDate: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">終了日</label>
          <input
            type="date"
            value={taskData.endDate}
            onChange={(e) =>
              setTaskData({ ...taskData, endDate: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            開始バッファー（日）
          </label>
          <input
            type="number"
            min="0"
            value={taskData.bufferBefore}
            onChange={(e) =>
              setTaskData({
                ...taskData,
                bufferBefore: parseInt(e.target.value),
              })
            }
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            終了バッファー（日）
          </label>
          <input
            type="number"
            min="0"
            value={taskData.bufferAfter}
            onChange={(e) =>
              setTaskData({
                ...taskData,
                bufferAfter: parseInt(e.target.value),
              })
            }
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          タスクを追加
        </button>
      </div>
    </form>
  );
};
