import { LayoutGrid, Cpu, Terminal, BookOpen, Settings, Hexagon } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarItemProps {
    icon: React.ElementType;
    label?: string;
    active?: boolean;
}

function SidebarItem({ icon: Icon, active }: SidebarItemProps) {
    return (
        <div
            className={clsx(
                "p-3 cursor-pointer transition-none border-l-2",
                active
                    ? "border-blue-500 text-white bg-[#111]"
                    : "border-transparent text-gray-500 hover:text-white hover:bg-[#111] hover:border-gray-700"
            )}
        >
            <Icon size={24} strokeWidth={1.5} />
        </div>
    );
}

export function Sidebar() {
    return (
        <aside className="w-16 bg-black flex flex-col items-center py-4 border-r border-[#2b2b2b] h-screen select-none">
            {/* Brand / Logo */}
            <div className="mb-6 text-blue-500">
                <Hexagon size={28} strokeWidth={2} />
            </div>

            <nav className="flex-1 flex flex-col gap-2 w-full">
                <SidebarItem icon={LayoutGrid} active />
                <SidebarItem icon={Cpu} />
                <SidebarItem icon={Terminal} />
                <SidebarItem icon={BookOpen} />
            </nav>

            <div className="flex flex-col gap-2 w-full">
                <SidebarItem icon={Settings} />
            </div>
        </aside>
    );
}
