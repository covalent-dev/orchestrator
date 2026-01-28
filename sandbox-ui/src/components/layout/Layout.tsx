import { Sidebar } from './Sidebar';
import { Header } from './Header';

type View = 'sessions' | 'queue';

interface LayoutProps {
    children: React.ReactNode;
    onNewTask?: () => void;
    activeView?: View;
    onViewChange?: (view: View) => void;
}

export function Layout({ children, onNewTask, activeView = 'queue', onViewChange }: LayoutProps) {
    return (
        <div className="flex h-screen bg-black text-gray-300 overflow-hidden font-mono">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header onNewTask={onNewTask} activeView={activeView} onViewChange={onViewChange} />
                <main className="flex-1 overflow-auto bg-black relative">
                    {children}
                </main>

                {/* Status Bar */}
                <footer className="h-6 bg-black border-t border-[#333] text-gray-400 flex items-center px-3 text-xs justify-between select-none font-mono">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500"></span>
                            Connected to Localhost
                        </span>
                        <span>main*</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span>Ln 1, Col 1</span>
                        <span>UTF-8</span>
                        <span>TypeScript React</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
