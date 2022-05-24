<template>
  <div class="max-w-screen-sm mx-auto px-4 py-10">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <!-- Forgot Password Form -->
    <form @submit.prevent="forgotPassword" class="p-8 flex flex-col bg-light-grey rounded-md shadow-lg">
      <h1 class="text-3xl text-at-light-green mb-4">Forgot Password</h1>

      <div class="flex flex-col mb-2">
        <label for="email" class="mb-1 text-sm text-at-light-green">Email</label>
        <input type="text" required class="p-2 mb-2 text-gray-500 focus:outline-none" id="email" v-model="email"/>
      </div>

      <p>Note: Once you get a magic link to sign in you can reset your password in the profile area.</p>

      <button type="submit" class="mt-6 py-2 px-6 rounded-sm self-start text-sm
      text-white bg-at-light-green duration-200 border-solid
      border-2 border-transparent hover:border-at-light-green hover:bg-white
      hover:text-at-light-green">
        Forgot Password
      </button>

    </form>
  </div>
</template>
<script>
import {supabase} from "@/supabase/init";
import {ref} from "vue";
// import {useRouter} from "vue-router";
import {useProgress} from "@marcoschulte/vue3-progress"

export default {
  name: "ForgotPassword",
  setup () {
    // Data vars
    // const router = useRouter()
    const email = ref(null)
    const errorMsg = ref(null)
    let progresses = []

    const forgotPassword = async () => {
      try {
        const progress = useProgress().start()
        progresses.push(progress)
        const {user, error} = await supabase.auth.api.resetPasswordForEmail(email.value)
        if(error) throw error
        errorMsg.value = `Check your email for a link`
        setTimeout(() => {
          errorMsg.value = null
        }, 7500)
        return user
      } catch (error) {
        errorMsg.value = `Error: ${error.message}`
        progresses.pop()?.finish()
        setTimeout(() => {
          errorMsg.value = null
        }, 7500)
      } finally {
        progresses.pop()?.finish()
      }
    }
    return {forgotPassword, email, errorMsg}
  },
}
</script>