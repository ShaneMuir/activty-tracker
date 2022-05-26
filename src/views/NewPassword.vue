<template>
  <div class="max-w-screen-sm mx-auto px-4 py-10">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <!-- Forgot Password Form -->
    <form @submit.prevent="newPassword" class="p-8 flex flex-col bg-light-grey rounded-md shadow-lg">
      <h1 class="text-3xl text-at-blue mb-4">New Password</h1>

      <div class="flex flex-col mb-2 password-field">
<!--        <label for="password" class="mb-1 text-sm text-at-blue">New Password</label>-->
        <input :type="passwordFieldType" required class="p-2 mb-2 text-gray-500 focus:outline-none" id="password" v-model="password"/>
        <i @click="showPassword" :class="{active: passwordActive}" class="fas fa-eye"></i>
      </div>

      <button type="submit" class="mt-6 py-2 px-6 rounded-sm self-start text-sm
      text-white bg-at-blue duration-200 border-solid
      border-2 border-transparent hover:border-at-blue hover:bg-white
      hover:text-at-blue">
        Update Password
      </button>

    </form>
  </div>
</template>
<script>
import {computed, ref} from "vue";
import {useProgress} from "@marcoschulte/vue3-progress";
import {supabase} from "@/supabase/init";
import {useRouter} from "vue-router";
import store from "@/store";

export default  {
  name: "NewPassword",
  data() {
    return {
      passwordFieldType: 'password',
      passwordActive: false,
    }
  },
  methods: {
    showPassword() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
      this.passwordActive = this.passwordFieldType !== 'password'
    },
  },
  setup() {
    const password = ref(null)
    const errorMsg = ref(null)
    const router = useRouter()
    const user = computed(() => store.state.user)
    let progresses = []

      const newPassword = async () => {
        try {
          const progress = useProgress().start()
          progresses.push(progress)
          const {error} = await supabase.auth.update({
            password: password.value
          })
          if (error) throw error
          progresses.pop()?.finish()
          await router.push({name: 'Profile', params: {id: user.value.id}})
        } catch (error) {
          errorMsg.value = `Error: ${error.message}`
          progresses.pop()?.finish()
          setTimeout(() => {
            errorMsg.value = null
          }, 7500)
        }
        finally {
          progresses.pop()?.finish()
        }
      }

    return {password, newPassword, errorMsg}
  },
}
</script>