<template>
  <div class="max-w-screen-md mx-auto px-4 py-10">
    <!-- Error Message -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <!-- Update Profile From -->
    <form @submit.prevent="updateProfile" class="p-8 flex flex-col bg-light-grey rounded-md shadow-lg">
      <h1 class="text-3xl text-at-blue mb-4">Update Profile</h1>

      <div class="flex flex-col mb-2">
        <label for="username" class="mb-1 text-sm text-at-blue">Username</label>
        <input type="text" required class="p-2 mb-2 text-gray-500 border border-at-blue focus:outline-none" id="username"
               :value="username" disabled/>
      </div>

      <div class="flex flex-col mb-2">
        <label for="avatar_url" class="mb-1 text-sm text-at-blue">Avatar URL</label>
        <input type="text" class="p-2 mb-2 border border-at-blue text-gray-500 focus:outline-none" id="avatar_url"
               v-model="avatar_url"/>
        <div class="avatar-container flex flex-row content-center gap-10 mt-4 mb-4">
          <img class="h-24 w-auto" :src="avatar_url" alt="">
          <button v-if="avatar_url" class="mt-6 py-2 px-6 rounded-sm self-start text-sm text-white bg-at-blue
         duration-200 border-solid border-2 border-transparent hover:border-white
          hover:bg-white hover:text-at-blue" @click.prevent="getAvatarUrl">Regenerate
          </button>
          <button v-else class="mt-6 py-2 px-6 rounded-sm self-start text-sm text-white bg-at-blue
         duration-200 border-solid border-2 border-transparent hover:border-white
          hover:bg-white hover:text-at-blue" @click.prevent="getAvatarUrl">Generate Avatar
          </button>
        </div>
      </div>

      <div class="flex flex-col mb-2">
        <label for="avatar_url" class="mb-1 text-sm text-at-blue">Date of birth</label>
        <input type="date" class="p-2 mb-2 border border-at-blue text-gray-500 focus:outline-none" id="DOB"
               v-model="DOB"/>
      </div>

      <div class="flex gap-10 mb-2">
        <div class="flex flex-col mb-2">
          <label for="weight" class="mb-1 text-sm text-at-blue">Weight (kg)</label>
          <input type="number" class="p-2 mb-2 border border-at-blue text-gray-500 focus:outline-none" id="weight"
                 v-model="weight"/>
        </div>
        <div class="flex flex-col mb-2">
          <label for="height" class="mb-1 text-sm text-at-blue">Height (cm)</label>
          <input type="number" class="p-2 mb-2 border border-at-blue text-gray-500 focus:outline-none" id="height"
                 v-model="height"/>
        </div>
      </div>

      <div class="flex flex-col mb-2">
        <label for="goal" class="mb-1 text-sm text-at-blue">Your Goal</label>
        <select v-model="goal" name="goals" id="goals" class="p-2 mb-2 border border-at-blue text-gray-500 focus:outline-none cursor-pointer">
          <option v-for="(item, index) in options" :key="index" :value="item">
            {{item}}
          </option>
        </select>
      </div>

      <input
          type="submit"
          class="mt-6 py-2 px-6 rounded-sm self-start text-sm text-white bg-at-blue
         duration-200 border-solid border-2 border-transparent hover:border-white
          hover:bg-white hover:text-at-blue"
          :value="loading ? 'Loading...' : 'Update'"
          :disabled="loading"
      />
    </form>
  </div>
</template>

<script>
import store from "@/store/index";
import {onMounted, ref} from "vue"
import {supabase} from "@/supabase/init";
import {uid} from "uid";
import {useProgress} from '@marcoschulte/vue3-progress';
import {useRouter} from "vue-router";

export default {
  name: "UpdateProfile",
  setup () {
    // Data vars
    const user = store.state.user
    const router = useRouter()
    const username = ref(null)
    const errorMsg = ref(null)
    const DOB = ref(null)
    const weight = ref(null)
    const height = ref(null)
    const options = ['Lose Weight', 'Gain Muscle']
    const goal = ref(null)
    const avatar_url = ref(null)
    const loading = ref(true)
    let progresses = []

    // Method to get profile data
    const getProfile = async () => {
      try {
        loading.value = true
        const progress = useProgress().start()
        progresses.push(progress)
        const {data, error} = await supabase
            .from('profiles')
            .select()
            .match({id: user.id})
            .single()
        username.value = data.username
        avatar_url.value = data.avatar_url
        DOB.value = data.DOB
        weight.value = data.Weight
        height.value = data.Height
        goal.value = data.Goal
        if(error) {
          throw error
        }
      }
      catch(error) {
        errorMsg.value = error.message
        progresses.pop()?.finish()
        setTimeout(() => {
          errorMsg.value = null
        }, 7500)
      }
      finally {
        loading.value = false
        progresses.pop()?.finish()
      }
    }
    // Get profile data
    onMounted(() => {
      getProfile()
    })

    // Update user profile
    const updateProfile = async () => {
      try {
        loading.value = true
        const progress = useProgress().start()
        progresses.push(progress)

        const updates = {
          id: user.id,
          username: username.value,
          avatar_url: avatar_url.value,
          DOB: DOB.value,
          Weight: weight.value,
          Height: height.value,
          Goal: goal.value,
        }

        let {error} = await supabase
            .from('profiles')
            .upsert(updates, {
              returning: "minimal",
            })
        if(error) throw error
        await router.push({name: 'Profile', params: {id: user.id}})
      }
      catch(error) {
        errorMsg.value = error.message
        progresses.pop()?.finish()
        setTimeout(() => {
          errorMsg.value = null
        }, 7500)
      }
      finally {
        loading.value = false
        progresses.pop()?.finish()
      }
    }

    /*
 Generate a random an avatar.
 */
    const getAvatarUrl = () => {
      const avatar = username.value + uid()
      const url = `https://avatars.dicebear.com/api/big-smile/${avatar}.svg`
      return avatar_url.value = url
    }

    return {user, username, avatar_url, DOB, weight,
      goal, height, getAvatarUrl, errorMsg, loading, options, updateProfile}
  }
}
</script>
