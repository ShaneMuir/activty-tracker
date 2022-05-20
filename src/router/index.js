import { createRouter, createWebHistory } from "vue-router"
import Home from "@/views/Home.vue"
import Register from "@/views/Register.vue"
import Login from "@/views/Login.vue"
import Profile from "@/views/Profile"
import Create from "@/views/Create";
import ViewWorkout from "@/views/ViewWorkout";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/create",
    name: "Create",
    component: Create,
  },
  {
    path: "/profile/:id",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/view-workout/:workoutId",
    name: "View-Workout",
    component: ViewWorkout,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Change document titles

// Route guard for auth routes

export default router;
