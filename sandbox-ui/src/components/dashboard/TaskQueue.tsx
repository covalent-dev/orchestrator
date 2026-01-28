import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchQueue, launchTask, getTaskDetail, type QueueItem, type QueueData } from '../../api/client';
import { useState } from 'react';
import { Play, Clock, AlertCircle, CheckCircle, ChevronRight, X } from 'lucide-react';

const priorityColors: Record<string, string> = {
    p0: 'text-red-500 border-red-500',
    p1: 'text-orange-500 border-orange-500',
    p2: 'text-blue-500 border-blue-500',
    p3: 'text-gray-500 border-gray-500',
};

const stateConfig = {
    pending: { icon: Clock, label: 'PENDING', color: 'text-yellow-500', bg: 'bg-black border-yellow-500' },
    'in-progress': { icon: Play, label: 'IN PROGRESS', color: 'text-blue-500', bg: 'bg-black border-blue-500' },
    blocked: { icon: AlertCircle, label: 'BLOCKED', color: 'text-red-500', bg: 'bg-black border-red-500' },
    completed: { icon: CheckCircle, label: 'COMPLETED', color: 'text-green-500', bg: 'bg-black border-green-500' },
};

interface TaskDetailPanelProps {
    taskId: string;
    onClose: () => void;
    onLaunch: (taskId: string, model?: string) => void;
}

function TaskDetailPanel({ taskId, onClose, onLaunch }: TaskDetailPanelProps) {
    const [selectedModel, setSelectedModel] = useState('');
    const { data: task, isLoading } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskDetail(taskId),
    });

    if (isLoading) {
        return (
            <div className="bg-black border-l border-[#333] w-96 p-4">
                <div className="animate-pulse text-gray-500 font-mono">LOADING...</div>
            </div>
        );
    }

    return (
        <div className="bg-black border-l border-[#333] w-96 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-[#333]">
                <h3 className="font-bold text-white truncate font-mono uppercase">{task?.title || taskId}</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-white">
                    <X size={18} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex gap-2 flex-wrap font-mono text-xs">
                    {task?.priority && (
                        <span className={`px-2 py-1 border ${priorityColors[task.priority] || priorityColors.p2} uppercase font-bold`}>
                            {task.priority}
                        </span>
                    )}
                    {task?.agent && (
                        <span className="px-2 py-1 border border-purple-500 text-purple-500 uppercase font-bold">
                            {task.agent}
                        </span>
                    )}
                    {task?.state && (
                        <span className="px-2 py-1 bg-[#222] text-gray-400 border border-[#333] uppercase">
                            {task.state}
                        </span>
                    )}
                </div>

                {task?.content && (
                    <div className="bg-black border border-[#333] p-3 text-sm text-gray-300 font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">
                        {task.content}
                    </div>
                )}

                {task?.state === 'pending' && (
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase">Model Override</label>
                        <select
                            value={selectedModel}
                            onChange={e => setSelectedModel(e.target.value)}
                            className="w-full bg-black border border-[#333] p-2 text-sm focus:border-white outline-none font-mono rounded-none"
                        >
                            <option value="">DEFAULT</option>
                            <option value="sonnet">SONNET</option>
                            <option value="opus">OPUS</option>
                            <option value="gpt-4o">GPT-4O</option>
                            <option value="o3">O3</option>
                            <option value="gemini-2.5-pro">GEMINI 2.5 PRO</option>
                        </select>
                    </div>
                )}
            </div>

            {task?.state === 'pending' && (
                <div className="p-4 border-t border-[#333]">
                    <button
                        onClick={() => onLaunch(taskId, selectedModel || undefined)}
                        className="w-full px-4 py-3 bg-green-600 hover:bg-green-500 text-black text-sm font-bold flex items-center justify-center gap-2 transition-none uppercase rounded-none"
                    >
                        <Play size={16} fill="currentColor" />
                        LAUNCH_TASK
                    </button>
                </div>
            )}
        </div>
    );
}

export function TaskQueue() {
    const [selectedTask, setSelectedTask] = useState<string | null>(null);
    const [showCompleted, setShowCompleted] = useState(false);
    const queryClient = useQueryClient();

    const { data: queue, isLoading } = useQuery({
        queryKey: ['queue'],
        queryFn: fetchQueue,
        refetchInterval: 3000,
    });

    const launchMutation = useMutation({
        mutationFn: ({ taskId, model }: { taskId: string; model?: string }) => launchTask(taskId, model),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['queue'] });
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            setSelectedTask(null);
        },
    });

    if (isLoading) {
        return <div className="text-gray-500 p-4 font-mono">LOADING_QUEUE...</div>;
    }

    const renderColumn = (state: keyof typeof stateConfig, tasks: QueueItem[]) => {
        const config = stateConfig[state];
        const Icon = config.icon;

        return (
            <div className="flex-1 min-w-[280px] bg-black border border-[#333] flex flex-col max-h-full">
                <div className={`p-3 border-b border-[#333] bg-[#111]`}>
                    <div className="flex items-center gap-2">
                        <Icon size={16} className={config.color} />
                        <span className={`font-bold uppercase tracking-tight ${config.color}`}>{config.label}</span>
                        <span className="ml-auto text-xs text-black bg-[#333] text-white px-2 py-0.5 font-bold">
                            {tasks.length}
                        </span>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {tasks.map(task => (
                        <div
                            key={task.id}
                            onClick={() => setSelectedTask(task.id)}
                            className={`p-3 bg-black border cursor-pointer hover:border-white transition-none ${selectedTask === task.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-[#333]'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <span className="text-sm text-gray-300 line-clamp-2 font-mono">{task.title}</span>
                                <ChevronRight size={14} className="text-gray-600 flex-shrink-0 mt-1" />
                            </div>
                            <div className="flex gap-1 mt-3 flex-wrap">
                                {task.priority && (
                                    <span className={`text-[10px] px-1 py-0.5 border ${priorityColors[task.priority] || priorityColors.p2} font-bold uppercase`}>
                                        {task.priority}
                                    </span>
                                )}
                                {task.agent && (
                                    <span className="text-[10px] px-1 py-0.5 border border-purple-500 text-purple-500 font-bold uppercase">
                                        {task.agent}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div className="text-center text-gray-700 text-xs py-8 uppercase tracking-widest">No tasks</div>
                    )}
                </div>
            </div>
        );
    };

    const activeStates: (keyof QueueData)[] = ['pending', 'in-progress', 'blocked'];
    if (showCompleted) activeStates.push('completed');

    return (
        <div className="flex h-full font-mono">
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white uppercase tracking-tight border-l-4 border-blue-500 pl-3">Task Queue</h2>
                    <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showCompleted}
                            onChange={e => setShowCompleted(e.target.checked)}
                            className="bg-black border border-[#333] rounded-none focus:ring-0 checked:bg-blue-500"
                        />
                        SHOW_COMPLETED
                    </label>
                </div>
                <div className="flex gap-4 overflow-x-auto flex-1 pb-2">
                    {activeStates.map(state => renderColumn(state, queue?.[state] || []))}
                </div>
            </div>

            {selectedTask && (
                <TaskDetailPanel
                    taskId={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onLaunch={(taskId, model) => launchMutation.mutate({ taskId, model })}
                />
            )}
        </div>
    );
}
