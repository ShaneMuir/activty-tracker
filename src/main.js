import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/tailwind.css";
import {Vue3ProgressPlugin} from '@marcoschulte/vue3-progress';

createApp(App)
  .use(router)
    .use(Vue3ProgressPlugin)
  .mount("#app");
