import { Task, TimelineViewType } from '@/types/task';

export const calculateTaskPosition = (
    task: Task,
    startDate: string,
    scale: number
) => {
    // バッファーを含めた開始日と終了日を計算
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    const timelineStart = new Date(startDate);

    taskStart.setDate(taskStart.getDate() - task.bufferBefore);
    taskEnd.setDate(taskEnd.getDate() + task.bufferAfter);

    const left = (taskStart.getTime() - timelineStart.getTime()) / (24 * 60 * 60 * 1000) * scale;
    const width = (taskEnd.getTime() - taskStart.getTime()) / (24 * 60 * 60 * 1000) * scale;

    return { left, width };
}

interface GridLine {
    position: number;
    label: string;
    type: 'major' | 'minor';
}

const formatDayLabel = (date: Date): string => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
}

const formatMonthLabel = (date: Date): string => {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

const formatQuarterLabel = (date: Date): string => {
    const month = date.getMonth();
    const quarterMap: { [key: number]: string } = {
        0: '1Q', // 1-3月
        3: '2Q', // 4-6月
        6: '3Q', // 7-9月
        9: '4Q'  // 10-12月
    };
    return `${date.getFullYear()} ${quarterMap[month]}`;
}

export const generateTimelineGrid = (
    startDate: string,
    endDate: string,
    viewType: TimelineViewType
) => {
    const gridLines: GridLine[] = [];
    let currentDate = new Date(startDate);
    const timelineEnd = new Date(endDate);

    // 開始日を月/四半期の始まりに合わせる
    if (viewType === 'month' || viewType === 'quarter') {
        currentDate.setDate(1);
    }

    while (currentDate <= timelineEnd) {
        const position = (currentDate.getTime() - new Date(startDate).getTime()) / (24 * 60 * 60 * 1000);

        switch (viewType) {
            case 'day':
                // 毎日の線（細い線）
                gridLines.push({
                    position,
                    label: formatDayLabel(currentDate),
                    type: currentDate.getDate() === 1 ? 'major' : 'minor'
                });
                currentDate.setDate(currentDate.getDate() + 1);
                break;

            case 'month':
                // 月の始まりのみ
                if (currentDate.getDate() === 1) {
                    gridLines.push({
                        position,
                        label: formatMonthLabel(currentDate),
                        type: 'major'
                    });
                }
                // 15日にも線を追加
                if (currentDate.getDate() === 15) {
                    gridLines.push({
                        position,
                        label: '',
                        type: 'minor'
                    });
                }
                currentDate.setDate(currentDate.getDate() + 1);
                break;

            case 'quarter':
                // 四半期の始まり
                if (currentDate.getDate() === 1 && [0, 3, 6, 9].includes(currentDate.getMonth())) {
                    gridLines.push({
                        position,
                        label: formatQuarterLabel(currentDate),
                        type: 'major'
                    });
                }
                // 四半期の中間月の1日にも線を追加
                if (currentDate.getDate() === 1 && [1, 4, 7, 10].includes(currentDate.getMonth())) {
                    gridLines.push({
                        position,
                        label: '',
                        type: 'minor'
                    });
                }
                currentDate.setDate(currentDate.getDate() + 1);
                break;
        }
    }

    return gridLines;
}

export const getTimelineStartEnd = (tasks: Task[]) => {
    if (tasks.length === 0) {
        const now = new Date();
        const start = new Date(now);
        const end = new Date(now);
        end.setMonth(end.getMonth() + 1);
        return {
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0],
        };
    }

    // タスクの開始日と終了日を取得（バッファーを含む）
    const taskStartDates = tasks.map(
        (task) => {
            const date = new Date(task.startDate);
            date.setDate(date.getDate() - task.bufferBefore);
            return date.getTime();
        }
    );
    const taskEndDates = tasks.map(
        (task) => {
            const date = new Date(task.endDate);
            date.setDate(date.getDate() + task.bufferAfter);
            return date.getTime();
        }
    );

    const start = new Date(Math.min(...taskStartDates));
    const end = new Date(Math.max(...taskEndDates));

    // 表示範囲に少し余裕を持たせる（前後1週間）
    start.setDate(start.getDate() - 7);
    end.setDate(end.getDate() + 7);

    return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
    };
}; 