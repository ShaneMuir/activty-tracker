<template>
  <vue3-progress-bar></vue3-progress-bar>
  <div class="font-Nunito">
    <Navigation/>
    <div v-if="appReady" class="min-h-full box-border">
      <router-view />
    </div>
    <Footer/>
  </div>
</template>

<script>
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {ref} from "vue";
import {supabase} from "@/supabase/init";
import store from "@/store";

export default {
  components: {Navigation, Footer},
  setup() {
    // Create data / vars
    const appReady = ref(null)

    // Check to see if user is already logged in
    const user = supabase.auth.user()


    // If user does not exist, need to make app ready
    if(!user) {
      appReady.value = true
    }

    // Runs when there is an auth state change
    // if user is logged in, this will fire
    supabase.auth.onAuthStateChange((_, session) => {
      store.methods.setUser(session)
      appReady.value = true
    })

    return {appReady};
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900&display=swap');
</style>
