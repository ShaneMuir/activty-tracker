import { createRouter, createWebHistory } from "vue-router"
import Home from "@/views/Home.vue"
import Register from "@/views/Register.vue"
import Login from "@/views/Login.vue"
import Profile from "@/views/Profile"
import Create from "@/views/Create"
import ViewWorkout from "@/views/ViewWorkout"
import UpdateProfile from "@/views/UpdateProfile"
import ForgotPassword from "@/views/ForgotPassword";
import NewPassword from "@/views/NewPassword"

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
    path: "/update_profile/:id",
    name: "UpdateProfile",
    component: UpdateProfile,
  },
  {
    path: "/workout/:workoutId",
    name: "View-Workout",
    component: ViewWorkout,
  },
  {
    name: "ForgotPassword",
    path: "/forgotPassword",
    component: ForgotPassword,
  },
  {
    name: "NewPassword",
    path: "/newPassword",
    component: NewPassword,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Change document titles

// Route guard for auth routes

export default router;
