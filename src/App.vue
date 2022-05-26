<template>
  <vue3-progress-bar></vue3-progress-bar>
  <Navigation/>
  <div v-if="appReady" class="min-h-full font-Poppins box-border">
    <router-view />
  </div>
  <Footer/>
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
    } else {
      const getProfile = async () => {
        try {
          const {data} = await supabase.from('profiles').select('username').match({id: user.id})
          store.state.username = data[0].username
        }
        catch(error) {
          console.log(error)
        }
      }
      getProfile()
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
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700&display=swap");
</style>

