export interface Task {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    bufferBefore: number;
    bufferAfter: number;
    color: string;
}

export type TimelineViewType = 'day' | 'month' | 'quarter'; 