import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useProjectStore } from './store/projectStore';
import { useTaskStore } from './store/taskStore';
import { useAuthStore } from './store/authStore';
import axios from './api/axios';
// import ProjectList from './components/ProjectList';
// import TaskList from './components/TaskList';
import AddProjectModal from './components/AddProjectModal';
import { AddTaskModal } from './components/AddTaskModal';
import { AddCategoryModal } from './components/AddCategoryModal';
import { JoinProjectModal } from './components/JoinProjectModal';
import SharedProjectPage from './pages/SharedProjectPage';
import MainContent from './components/MainContent';

function App() {
  const { projects, currentProject, fetchProjects } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isJoinProjectModalOpen, setIsJoinProjectModalOpen] = useState(false);
  const { checkAuth, user, setUser } = useAuthStore();
  const navigate = useNavigate();

  console.log({ projects, tasks });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  useEffect(() => {
    if (currentProject?.id) {
      fetchTasks(currentProject.id);
    }
  }, [currentProject?.id]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // @ts-ignore
        const telegramData = window.Telegram.WebApp.initData;
        if (telegramData) {
          const response = await axios.post('/auth/telegram', {
            initData: telegramData
          });
          setUser(response.data.user);
        } else {
          navigate('/auth');
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        navigate('/auth');
      }
    };

    initializeAuth();
  }, [navigate]);

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/projects/share/:code" element={<SharedProjectPage />} />
      </Routes>

      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
      />

      <JoinProjectModal
        isOpen={isJoinProjectModalOpen}
        onClose={() => setIsJoinProjectModalOpen(false)}
      />

      {currentProject && (
        <>
          <AddTaskModal
            isOpen={isAddTaskModalOpen}
            onClose={() => setIsAddTaskModalOpen(false)}
            currentProject={currentProject}
          />
          <AddCategoryModal
            isOpen={isAddCategoryModalOpen}
            onClose={() => setIsAddCategoryModalOpen(false)}
          />
        </>
      )}
    </Router>
  );
}

export default App;