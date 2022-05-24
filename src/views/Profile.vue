<template>
  <div v-if="dataLoaded" class="container mt-10 px-4">
    <!-- Profile -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div class="flex flex-col items-center bg-light-grey p-8 shadow-md cursor-pointer">
        <!-- Profile Img -->
        <img :src="avatar_url" class="h-24 w-auto" alt=""/>

        <p class="mt-6 py-1 px-3 text-xs text-white bg-at-light-green shadow-md rounded-lg">
          {{ username }}
        </p>

        <p class="mt-4 mb-2 text-center text-xl text-at-light-green">Age:</p>
        <p>{{ getAge(DOB) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import {supabase} from "@/supabase/init";
import {ref} from "vue";
import { uid } from "uid"

export default {
  name: "Profile",
  components: {},
  setup() {
    // Create data / vars
    const user = supabase.auth.user()
    const username = ref(null)
    const DOB = ref(null)
    const avatar_url = ref(null)
    const dataLoaded = ref(null)

    // Get data
    const getProfile = async () => {
      try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select()
            .match({id: user.id})
            .single()
        if(error) throw error
        console.log(profile)
        username.value = profile.username
        DOB.value = profile.DOB
        avatar_url.value = profile.avatar_url
        dataLoaded.value = true
      } catch (error) {
        console.warn(error.message)
      }
    }

    // Get users age function
    const getAge = (dateString) => {
      let today = new Date(), birthDate = new Date(dateString),
      age = today.getFullYear() - birthDate.getFullYear(), m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
      {
        age--;
      }
      return age;
    }

    const getAvatarUrl = () => {
      const avatar = username.value + uid()
      return `https://avatars.dicebear.com/api/big-smile/${avatar}.svg`;
    }


    // Run data function
    getProfile();
    return {username, DOB, avatar_url, dataLoaded, getAge, getAvatarUrl};
  },
};
</script>
