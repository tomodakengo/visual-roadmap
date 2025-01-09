"use client";

import { Timeline } from "@/components/Timeline/Timeline";
import { TaskForm } from "@/components/TaskForm/TaskForm";
import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import { TaskEditForm } from "@/components/TaskForm/TaskEditForm";
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";

const STORAGE_KEY = "roadmap-tasks";

export function RoadmapClient() {
  const initialTasks: Task[] = [
    {
      id: "1",
      name: "プロジェクト計画策定",
      startDate: "2024-01-10",
      endDate: "2024-01-31",
      bufferBefore: 2,
      bufferAfter: 3,
      color: "#4A90E2",
    },
    {
      id: "2",
      name: "要件定義・ヒアリング",
      startDate: "2024-02-05",
      endDate: "2024-03-15",
      bufferBefore: 2,
      bufferAfter: 3,
      color: "#50C878",
    },
    {
      id: "3",
      name: "基本設計",
      startDate: "2024-03-20",
      endDate: "2024-04-30",
      bufferBefore: 2,
      bufferAfter: 4,
      color: "#FF7F50",
    },
    {
      id: "4",
      name: "詳細設計",
      startDate: "2024-05-07",
      endDate: "2024-06-30",
      bufferBefore: 3,
      bufferAfter: 5,
      color: "#9370DB",
    },
    {
      id: "5",
      name: "フロントエンド開発",
      startDate: "2024-07-08",
      endDate: "2024-09-30",
      bufferBefore: 3,
      bufferAfter: 5,
      color: "#FF6B6B",
    },
    {
      id: "6",
      name: "バックエンド開発",
      startDate: "2024-07-08",
      endDate: "2024-09-30",
      bufferBefore: 3,
      bufferAfter: 5,
      color: "#FFB366",
    },
    {
      id: "7",
      name: "単体テスト",
      startDate: "2024-10-07",
      endDate: "2024-11-15",
      bufferBefore: 2,
      bufferAfter: 3,
      color: "#4ECDC4",
    },
    {
      id: "8",
      name: "結合テスト",
      startDate: "2024-11-20",
      endDate: "2024-12-20",
      bufferBefore: 2,
      bufferAfter: 3,
      color: "#45B7D1",
    },
    {
      id: "9",
      name: "ユーザーテスト",
      startDate: "2024-12-25",
      endDate: "2025-01-31",
      bufferBefore: 2,
      bufferAfter: 4,
      color: "#96C93D",
    },
    {
      id: "10",
      name: "本番環境準備・リリース",
      startDate: "2025-02-05",
      endDate: "2025-02-28",
      bufferBefore: 3,
      bufferAfter: 5,
      color: "#5D5D5D",
    },
  ];

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // タスクが更新されたらローカルストレージに保存
  useEffect(() => {
    if (tasks.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks:", error);
      }
    }
  }, [tasks]);

  // ローカルストレージからタスクを読み込む
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    if (!active) return;

    const taskId = active.id as string;
    const deltaX = delta.x;
    const daysDelta = Math.round(deltaX / 50); // 50pxを1日として計算

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const startDate = new Date(task.startDate);
    const endDate = new Date(task.endDate);

    startDate.setDate(startDate.getDate() + daysDelta);
    endDate.setDate(endDate.getDate() + daysDelta);

    handleUpdateTaskDates(
      taskId,
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0]
    );
  };

  // 画像として保存する関数
  const handleSaveAsImage = async () => {
    const timeline = document.querySelector(".timeline-content");
    const scrollContainer = document.querySelector(
      ".timeline-scroll-container"
    );
    if (!timeline || !scrollContainer) return;

    try {
      // スクロール位置を一時的に保存
      const originalScrollLeft = scrollContainer.scrollLeft;
      const originalOverflow = document.body.style.overflow;

      // スクロールを一時的に無効化
      document.body.style.overflow = "hidden";
      scrollContainer.scrollLeft = 0;

      // タイムラインの実際の幅を計算
      const timelineWidth = timeline.scrollWidth;
      const timelineHeight = timeline.scrollHeight;

      const htmlToImage = await import("html-to-image");
      const dataUrl = await htmlToImage.toPng(timeline as HTMLElement, {
        backgroundColor: "#ffffff",
        width: timelineWidth,
        height: timelineHeight,
        style: {
          transform: "none",
          width: `${timelineWidth}px`,
          height: `${timelineHeight}px`,
        },
        pixelRatio: 2, // 高解像度で出力
      });

      // 画像をダウンロード
      const link = document.createElement("a");
      link.download = `roadmap-${new Date().toISOString().split("T")[0]}.png`;
      link.href = dataUrl;
      link.click();

      // 状態を元に戻す
      scrollContainer.scrollLeft = originalScrollLeft;
      document.body.style.overflow = originalOverflow;
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  const handleAddTask = (taskData: Omit<Task, "id">) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
    };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (taskId: string, updatedTask: Omit<Task, "id">) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...updatedTask, id: taskId } : task
      )
    );
    setEditingTaskId(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    setEditingTaskId(null);
  };

  const handleUpdateTaskDates = (
    taskId: string,
    newStartDate: string,
    newEndDate: string
  ) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, startDate: newStartDate, endDate: newEndDate }
          : task
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">ロードマップジェネレーター</h1>
        <button
          onClick={handleSaveAsImage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          画像として保存
        </button>
      </div>

      <TaskForm onSubmit={handleAddTask} />

      {editingTaskId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-2xl w-full mx-4">
            <TaskEditForm
              task={tasks.find((t) => t.id === editingTaskId)!}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              onCancel={() => setEditingTaskId(null)}
            />
          </div>
        </div>
      )}

      <div className="timeline-container bg-white">
        <Timeline
          tasks={tasks}
          onEditTask={setEditingTaskId}
          onUpdateTaskDates={handleUpdateTaskDates}
        />
      </div>
    </div>
  );
}
