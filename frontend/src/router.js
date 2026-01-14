// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import Login from './pages/auth/Login.vue';  // asigură-te că ai calea corectă
import Signup from './pages/auth/Signup.vue';  // asigură-te că ai calea corectă
import ResetPassword  from './pages/auth/ResetPassword.vue';
import UpdatePassword from './pages/auth/UpdatePassword.vue';
import Home from './pages/dashboard/Home.vue'; // asigură-te că ai calea corectă
import Planner from './pages/dashboard/Planner.vue'; 
import BudgetPlannerPage from './pages/dashboard/BudgetPlannerPage.vue';
import Split from './pages/dashboard/Split.vue';  
import Account from './pages/dashboard/Account.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },

  {
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPassword
  },
  {
    path: "/update-password",
    name: "UpdatePassword",
    component: UpdatePassword
  },
  {
    path: '/home',
    name:"Home",
    component: Home
  },
  {
    path: '/planner',
    name:"Planner",
    component: Planner
  },
  {
    path: '/budget',
    name: 'BudgetPlannerPage',
    component: BudgetPlannerPage
  },
  {
    path: '/split',
    name: 'Split',
    component: Split
  },
  {
    path: '/account',
    name: 'Account',
    component: Account
  }
  
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
