import React, { useState, useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  useDraggable,
} from "@dnd-kit/core";
import { Task, TimelineViewType } from "@/types/task";
import {
  calculateTaskPosition,
  generateTimelineGrid,
  getTimelineStartEnd,
} from "@/utils/timelineUtils";
import { TaskPopover } from "@/components/TaskPopover/TaskPopover";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";

interface TimelineProps {
  tasks: Task[];
  onEditTask: (taskId: string) => void;
  onUpdateTaskDates: (
    taskId: string,
    newStartDate: string,
    newEndDate: string
  ) => void;
}

interface TaskBarProps {
  task: Task;
  left: number;
  width: number;
  scale: number;
  style?: React.CSSProperties;
  onEdit: (taskId: string) => void;
}

const TaskBar: React.FC<TaskBarProps> = ({
  task,
  left,
  width,
  scale,
  style,
  onEdit,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const [showPopover, setShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPopoverPosition({
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY + 10,
    });
    setShowPopover(true);
  };

  const totalWidth = width;
  const mainStartPosition = task.bufferBefore * scale;
  const mainWidth =
    ((new Date(task.endDate).getTime() - new Date(task.startDate).getTime()) /
      (24 * 60 * 60 * 1000)) *
    scale;

  const dragStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <>
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className="relative h-12 my-2 rounded-lg group cursor-move"
        style={{
          width: `${totalWidth}px`,
          left: `${left}px`,
          position: "absolute",
          ...style,
          ...dragStyle,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowPopover(false)}
      >
        {/* 開始バッファー */}
        {task.bufferBefore > 0 && (
          <div
            className="absolute h-full"
            style={{
              left: 0,
              width: `${mainStartPosition}px`,
              background: `repeating-linear-gradient(
                45deg,
                ${task.color}88,
                ${task.color}88 10px,
                ${task.color}44 10px,
                ${task.color}44 20px
              )`,
              zIndex: 1,
            }}
          />
        )}

        {/* メインタスク部分 */}
        <div
          className="absolute h-full"
          style={{
            left: `${mainStartPosition}px`,
            width: `${mainWidth}px`,
            backgroundColor: task.color,
            zIndex: 2,
          }}
        />

        {/* タスク名と期間を表示 */}
        <div
          className="absolute left-0 px-2 text-black font-medium"
          style={{
            left: `${mainStartPosition}px`,
            zIndex: 3,
            top: "2px",
          }}
        >
          <div className="whitespace-nowrap">{task.name}</div>
          <div className="text-xs whitespace-nowrap">
            {new Date(task.startDate).toLocaleDateString("ja-JP")} 〜{" "}
            {new Date(task.endDate).toLocaleDateString("ja-JP")}
          </div>
        </div>

        {/* 終了バッファー */}
        {task.bufferAfter > 0 && (
          <div
            className="absolute h-full"
            style={{
              left: `${mainStartPosition + mainWidth}px`,
              width: `${task.bufferAfter * scale}px`,
              background: `repeating-linear-gradient(
                45deg,
                ${task.color}88,
                ${task.color}88 10px,
                ${task.color}44 10px,
                ${task.color}44 20px
              )`,
              zIndex: 1,
            }}
          />
        )}

        {/* 編集ボタン */}
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:block"
          style={{ zIndex: 4 }}
        >
          <button
            className="p-1 bg-white rounded-full shadow hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task.id);
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        </div>
      </div>

      {showPopover && <TaskPopover task={task} position={popoverPosition} />}
    </>
  );
};

// TimelineHeaderコンポーネント
const TimelineHeader: React.FC<{
  gridLines: Array<{
    position: number;
    label: string;
    type: "major" | "minor";
  }>;
  scale: number;
}> = ({ gridLines, scale }) => (
  <div className="sticky top-0 h-20 bg-white border-b z-20">
    <div className="relative h-full">
      {gridLines.map((line, index) => (
        <div
          key={index}
          className={`absolute h-full flex flex-col items-center ${
            line.type === "major" ? "font-medium" : "font-normal"
          }`}
          style={{
            left: `${line.position * scale}px`,
            transform: "translateX(-50%)",
          }}
        >
          {line.label && (
            <div className="text-sm text-gray-600 py-2 px-1 bg-white rounded">
              {line.label}
            </div>
          )}
          <div
            className={`h-4 border-l ${
              line.type === "major" ? "border-gray-300" : "border-gray-200"
            }`}
          />
        </div>
      ))}
    </div>
  </div>
);

// TimelineGridコンポーネント
const TimelineGrid: React.FC<{
  gridLines: Array<{
    position: number;
    label: string;
    type: "major" | "minor";
  }>;
  scale: number;
  height: number;
}> = ({ gridLines, scale, height }) => (
  <div className="absolute inset-0" style={{ height }}>
    {gridLines.map((line, index) => (
      <div
        key={index}
        className={`absolute h-full ${
          line.type === "major"
            ? "border-l border-gray-300"
            : "border-l border-gray-200"
        }`}
        style={{
          left: `${line.position * scale}px`,
        }}
      />
    ))}
  </div>
);

export const Timeline: React.FC<TimelineProps> = ({
  tasks,
  onEditTask,
  onUpdateTaskDates,
}) => {
  const scaleConfig = {
    min: 2,
    max: 200,
    step: 2,
    default: 50,
  };

  const [scale, setScale] = useState(scaleConfig.default);

  const viewType = useMemo((): TimelineViewType => {
    if (scale >= 30) return "day";
    if (scale >= 10) return "month";
    return "quarter";
  }, [scale]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const { start: timelineStart, end: timelineEnd } = useMemo(
    () => getTimelineStartEnd(tasks),
    [tasks]
  );

  const gridLines = useMemo(
    () => generateTimelineGrid(timelineStart, timelineEnd, viewType),
    [timelineStart, timelineEnd, viewType]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    if (!active) return;

    const taskId = active.id as string;
    const deltaX = delta.x;
    const daysDelta = Math.round(deltaX / scale);

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const startDate = new Date(task.startDate);
    const endDate = new Date(task.endDate);

    startDate.setDate(startDate.getDate() + daysDelta);
    endDate.setDate(endDate.getDate() + daysDelta);

    onUpdateTaskDates(
      taskId,
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0]
    );
  };

  const handleZoom = (newScale: number) => {
    setScale(Math.max(scaleConfig.min, Math.min(scaleConfig.max, newScale)));
  };

  const timelineHeight = tasks.length * 60 + 32;

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToHorizontalAxis]}
    >
      <div>
        {/* ズームコントロール */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => handleZoom(scale - scaleConfig.step)}
            className="px-3 py-1 border rounded hover:bg-gray-100"
            disabled={scale <= scaleConfig.min}
          >
            ズームアウト
          </button>

          <input
            type="range"
            min={scaleConfig.min}
            max={scaleConfig.max}
            step={scaleConfig.step}
            value={scale}
            onChange={(e) => handleZoom(Number(e.target.value))}
            className="w-48"
          />

          <button
            onClick={() => handleZoom(scale + scaleConfig.step)}
            className="px-3 py-1 border rounded hover:bg-gray-100"
            disabled={scale >= scaleConfig.max}
          >
            ズームイン
          </button>

          <span className="text-sm text-gray-600">
            {scale}px/日
            {viewType !== "day" &&
              ` (${viewType === "month" ? "月表示" : "四半期表示"})`}
          </span>
        </div>

        {/* タイムライン */}
        <div className="w-full overflow-x-auto border rounded-lg timeline-scroll-container">
          <div className="relative bg-white timeline-content">
            <TimelineHeader gridLines={gridLines} scale={scale} />

            <div className="relative" style={{ height: timelineHeight }}>
              <TimelineGrid
                gridLines={gridLines}
                scale={scale}
                height={timelineHeight}
              />

              {/* タスクバー */}
              <div className="relative bg-white">
                {tasks.map((task, index) => {
                  const { left, width } = calculateTaskPosition(
                    task,
                    timelineStart,
                    scale
                  );
                  return (
                    <TaskBar
                      key={task.id}
                      task={task}
                      left={left}
                      width={width}
                      scale={scale}
                      style={{
                        top: `${index * 60}px`,
                      }}
                      onEdit={onEditTask}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
};
