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
    meta: {
      title: "Home"
    }
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      title: "Register"
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "Login"
    }
  },
  {
    path: "/create",
    name: "Create",
    component: Create,
    meta: {
      title: "Create Workout"
    }
  },
  {
    path: "/profile/:id",
    name: "Profile",
    component: Profile,
    meta: {
      title: "Profile Page"
    }
  },
  {
    path: "/update_profile/:id",
    name: "UpdateProfile",
    component: UpdateProfile,
    meta: {
      title: "Update Profile"
    }
  },
  {
    path: "/workout/:workoutId",
    name: "View-Workout",
    component: ViewWorkout,
    meta: {
      title: "View Workout"
    }
  },
  {
    name: "ForgotPassword",
    path: "/forgotPassword",
    component: ForgotPassword,
    meta: {
      title: "Forgot Password"
    }
  },
  {
    name: "NewPassword",
    path: "/newPassword",
    component: NewPassword,
    meta: {
      title: "New Password"
    }
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Change document titles
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | Activity Tracker`
  next()
})

// Route guard for auth routes

export default router;
