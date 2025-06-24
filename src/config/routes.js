import ContactManagement from "@/components/pages/ContactManagement";
import React from "react";
import TaskDashboard from "@/components/pages/TaskDashboard";

export const routeArray = [
  {
    id: 1,
    path: '/',
    component: TaskDashboard,
    label: 'Dashboard',
    icon: 'LayoutDashboard'
  },
  {
    id: 2,
    path: '/contacts',
    component: ContactManagement,
    label: 'Contacts',
icon: 'UserCircle'
  }
];