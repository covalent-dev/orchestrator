import { useState } from 'react';
import { SessionBoard } from '../components/dashboard/SessionBoard';
import { TaskQueue } from '../components/dashboard/TaskQueue';
import { Layout } from '../components/layout/Layout';
import { TaskModal } from '../components/dashboard/TaskModal';

type View = 'sessions' | 'queue';

export function Dashboard() {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [activeView, setActiveView] = useState<View>('queue');

    return (
        <Layout onNewTask={() => setIsTaskModalOpen(true)} activeView={activeView} onViewChange={setActiveView}>
            {activeView === 'sessions' && <SessionBoard />}
            {activeView === 'queue' && <TaskQueue />}
            <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
        </Layout>
    );
}
