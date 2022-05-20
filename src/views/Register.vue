<template>
  <div class="max-w-screen-sm mx-auto px-4 py-10">
    <!-- Error Message -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <!-- Register From -->
    <form @submit.prevent="register" class="p-8 flex flex-col bg-light-grey rounded-md shadow-lg">
      <h1 class="text-3xl text-at-light-green mb-4">Register</h1>

      <div class="flex flex-col mb-2">
        <label for="username" class="mb-1 text-sm text-at-light-green">Username</label>
        <input type="text" required class="p-2 mb-2 text-gray-500 focus:outline-none" id="Username"
        v-model="username"/>
      </div>

      <div class="flex flex-col mb-2">
        <label for="email" class="mb-1 text-sm text-at-light-green">Email</label>
        <input type="email" required class="p-2 mb-2 text-gray-500 focus:outline-none" id="email"
               v-model="email"/>
      </div>

      <div class="flex flex-col mb-2 password-field">
        <label for="password" class="mb-1 text-sm text-at-light-green">Password</label>
        <input :type="passwordFieldType" required class="p-2 mb-2 text-gray-500 focus:outline-none" id="password"
               v-model="password"/>
        <i @click="showPassword" :class="{active: passwordActive}" class="fas fa-eye"></i>
      </div>

        <button type="submit" class="mt-6 py-2 px-6 rounded-sm self-start text-sm text-white bg-at-light-green
         duration-200 border-solid border-2 border-transparent hover:border-white
          hover:bg-white hover:text-at-light-green">
          Register
        </button>

        <router-link :to="{name: 'Login'}" class="text-sm mt-6 text-center">
          Already have an account? <span class="text-at-light-green">Login</span>
        </router-link>
    </form>
  </div>
</template>

<script>
import {ref} from 'vue'
import {supabase} from "@/supabase/init"
import { useRouter } from 'vue-router'
import {useProgress} from '@marcoschulte/vue3-progress';

export default {
  name: "register",
  data() {
    return {
      passwordFieldType: 'password',
      passwordActive: false,
    }
  },
  methods: {
    showPassword() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
    },
  },
  setup() {
    // Create data / vars
    const router = useRouter();
    const username = ref(null)
    const email = ref(null)
    const password = ref(null)
    const errorMsg = ref(null)
    let progresses = []

    // Register function
    const register = async () => {
      const passwordRegex = new RegExp('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')
      if(passwordRegex.test(password.value)) {
        try {
          const progress = useProgress().start();
          progresses.push(progress)
          const {error } = await supabase.auth.signUp({
            username: username.value,
            email: email.value,
            password: password.value,
          })
          if(error) throw error
          localStorage.setItem('username', username.value)
          progresses.pop()?.finish()
          await router.push({name: 'Login'})
        } catch(error) {
          errorMsg.value = error.message
          progresses.pop()?.finish()
          setTimeout(() => {
            errorMsg.value = null
          }, 7500)
        }
      } else {
        progresses.pop()?.finish()
        errorMsg.value = `Password must contain 8 characters and have a mix
                          of letters, numbers and symbols.`
        setTimeout(() => {
          errorMsg.value = null
        }, 7500)
      }
    }
    return {username, email, password, errorMsg, register};
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/components/auth";
</style>
