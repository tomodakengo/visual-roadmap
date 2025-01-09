import React, { useState } from "react";
import { Task } from "@/types/task";

interface TaskEditFormProps {
  task: Task;
  onUpdate: (taskId: string, updatedTask: Omit<Task, "id">) => void;
  onDelete: (taskId: string) => void;
  onCancel: () => void;
}

export const TaskEditForm: React.FC<TaskEditFormProps> = ({
  task,
  onUpdate,
  onDelete,
  onCancel,
}) => {
  const [taskData, setTaskData] = useState({
    name: task.name,
    startDate: task.startDate,
    endDate: task.endDate,
    bufferBefore: task.bufferBefore,
    bufferAfter: task.bufferAfter,
    color: task.color,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(task.id, taskData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded-lg bg-white shadow-lg"
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

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          削除
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          更新
        </button>
      </div>
    </form>
  );
};
