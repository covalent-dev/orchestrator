import { Bell, Search, Plus, ListTodo, Monitor } from 'lucide-react';

type View = 'sessions' | 'queue';

interface HeaderProps {
    onNewTask?: () => void;
    activeView?: View;
    onViewChange?: (view: View) => void;
}

export function Header({ onNewTask, activeView = 'queue', onViewChange }: HeaderProps) {
    return (
        <header className="h-12 bg-black border-b border-[#333] flex items-center justify-between px-4 select-none">
            <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-white tracking-tight">AGENT_MANAGER</span>
                <span className="text-[#333]">/</span>
                <div className="flex items-center gap-px bg-[#333] border border-[#333]">
                    <button
                        onClick={() => onViewChange?.('queue')}
                        className={`px-3 py-1 text-sm flex items-center gap-1.5 transition-none ${activeView === 'queue'
                                ? 'bg-white text-black font-bold'
                                : 'bg-black text-gray-500 hover:text-white hover:bg-[#111]'
                            }`}
                    >
                        <ListTodo size={14} />
                        QUEUE
                    </button>
                    <button
                        onClick={() => onViewChange?.('sessions')}
                        className={`px-3 py-1 text-sm flex items-center gap-1.5 transition-none ${activeView === 'sessions'
                                ? 'bg-white text-black font-bold'
                                : 'bg-black text-gray-500 hover:text-white hover:bg-[#111]'
                            }`}
                    >
                        <Monitor size={14} />
                        SESSIONS
                    </button>
                </div>
            </div>

            {/* Middle - Search/Command Palette trigger */}
            <div className="flex-1 max-w-xl mx-4">
                <button className="w-full bg-black hover:bg-[#111] text-left px-3 py-1.5 text-sm text-gray-500 border border-[#333] flex items-center gap-2 transition-none group hover:border-gray-500">
                    <Search size={14} className="group-hover:text-white" />
                    <span className="group-hover:text-white">SEARCH_OR_JUMP...</span>
                    <span className="ml-auto text-xs text-[#333] border border-[#333] px-1 group-hover:text-gray-400 group-hover:border-gray-500">⌘K</span>
                </button>
            </div>

            <div className="flex items-center gap-3">
                <button className="text-gray-500 hover:text-white transition-none">
                    <Bell size={18} />
                </button>
                <button
                    onClick={onNewTask}
                    className="bg-[#000] border border-[#333] hover:border-white hover:bg-white hover:text-black text-white text-xs font-bold px-3 py-1.5 flex items-center gap-1 transition-none uppercase"
                >
                    <Plus size={14} />
                    New Task
                </button>
            </div>
        </header>
    );
}
