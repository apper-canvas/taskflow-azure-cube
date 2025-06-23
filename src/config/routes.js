import TaskDashboard from '@/components/pages/TaskDashboard';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Tasks',
    path: '/',
    icon: 'CheckSquare',
    component: TaskDashboard
  }
};

export const routeArray = Object.values(routes);
export default routes;