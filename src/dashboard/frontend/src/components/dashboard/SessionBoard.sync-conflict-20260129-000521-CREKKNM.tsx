import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSessions, killSession, type Session } from '../../api/client';
import { Play, Square, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { clsx } from 'clsx';

function SessionCard({ session }: { session: Session }) {
    const queryClient = useQueryClient();
    const killMutation = useMutation({
        mutationFn: killSession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
    });

    return (
        <div className="bg-[#252526] p-3 rounded-md border border-[#3f3f3f] shadow-sm hover:border-blue-500 transition-colors group">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-mono text-sm font-semibold text-gray-200 truncate" title={session.id}>
                    {session.id}
                </h3>
                <span className={clsx("text-xs px-1.5 py-0.5 rounded uppercase font-bold", {
                    'bg-green-900 text-green-300': session.status === 'running',
                    'bg-gray-700 text-gray-400': session.status === 'idle',
                    'bg-red-900 text-red-300': session.status === 'error',
                    'bg-blue-900 text-blue-300': session.status === 'done',
                })}>
                    {session.status}
                </span>
            </div>

            <div className="text-xs text-gray-400 mb-3">{session.message}</div>

            {session.progress && (
                <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden mb-3">
                    <div
                        className="bg-blue-500 h-full transition-all duration-300"
                        style={{ width: `${(session.progress.current / session.progress.total) * 100}%` }}
                    />
                </div>
            )}

            <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-gray-500">{session.agent_type}</span>
                <button
                    onClick={() => killMutation.mutate(session.id)}
                    className="text-red-400 hover:text-red-200 p-1 rounded hover:bg-white/5"
                    title="Kill Session"
                >
                    <Square size={12} fill="currentColor" />
                </button>
            </div>
        </div>
    );
}

export function SessionBoard() {
    const { data: sessions, isLoading } = useQuery({
        queryKey: ['sessions'],
        queryFn: fetchSessions,
        refetchInterval: 2000,
    });

    if (isLoading) return <div className="p-4 text-gray-500">Loading sessions...</div>;

    const grouped = {
        idle: sessions?.filter(s => s.status === 'idle') || [],
        working: sessions?.filter(s => ['running', 'working'].includes(s.status)) || [],
        done: sessions?.filter(s => s.status === 'done') || [],
        error: sessions?.filter(s => s.status === 'error') || [],
    };

    return (
        <div className="flex gap-4 h-full p-4 overflow-x-auto min-w-full">
            <Column title="Idle" count={grouped.idle.length} items={grouped.idle} icon={<Clock size={16} />} />
            <Column title="Working" count={grouped.working.length} items={grouped.working} icon={<Play size={16} />} />
            <Column title="Done" count={grouped.done.length} items={grouped.done} icon={<CheckCircle size={16} />} />
            <Column title="Error" count={grouped.error.length} items={grouped.error} icon={<AlertCircle size={16} />} />
        </div>
    );
}

function Column({ title, count, items, icon }: { title: string, count: number, items: Session[], icon: React.ReactNode }) {
    return (
        <div className="flex-1 min-w-[280px] bg-black flex flex-col">
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2 text-gray-300 font-medium text-sm">
                    {icon}
                    <span>{title}</span>
                </div>
                <span className="text-xs bg-[#2d2d2d] text-gray-400 px-2 py-0.5 rounded-full">{count}</span>
            </div>
            <div className="flex-1 bg-[#252526]/50 rounded-lg p-2 space-y-2 overflow-y-auto">
                {items.map(session => <SessionCard key={session.id} session={session} />)}
                {items.length === 0 && <div className="text-xs text-gray-600 text-center py-4">No sessions</div>}
            </div>
        </div>
    );
}
