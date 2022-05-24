<template>
  <h2 v-if="profileDataLoaded" class="mt-6 text-center text-3xl font-extrabold text-gray-900">{{ username }}'s Profile Page</h2>

  <div v-if="profileDataLoaded" class="container mt-10 px-4">
    <!-- Profile -->
    <div class="grid grid-cols-2 gap-6">
      <div class="flex flex-col items-center bg-light-grey p-8 shadow-md">
        <!-- Profile Img -->
        <img v-if="avatar_url" :src="avatar_url" class="h-24 w-auto" alt=""/>
        <img v-else :src="getAvatarUrl()" class="h-24 w-auto" alt="">

        <p class="mt-6 py-1 px-3 text-xs text-white bg-at-light-green shadow-md rounded-lg">
          {{ username }}
        </p>
        <p v-if="gender" class="mt-1 mb-1 text-center text-xl text-at-light-green">Gender:
          <span>
          {{ gender }}
        </span>
        </p>
        <p v-if="DOB" class="mt-1 mb-1 text-center text-xl text-at-light-green">Age:
        <span>
          {{ getAge(DOB) }}
        </span>
        </p>
        <p v-if="weight" class="mt-1 mb-1 text-center text-xl text-at-light-green">Weight:
        <span>
          {{ weight }}kg
        </span>
        </p>
        <p v-if="height" class="mt-1 mb-1 text-center text-xl text-at-light-green">Height:
        <span>
          {{ height }}cm
        </span>
        </p>
        <div v-if="goal" class="goal-wrapper">
          <p class="mt-1 mb-1 text-center text-xl text-at-light-green">Goal:</p>
          <p class="py-1 px-3 text-xs text-white bg-at-light-green shadow-md rounded-lg">
            {{ goal }}
          </p>
        </div>
      </div>

      <div v-if="weight && height" class="flex flex-col items-center bg-light-grey p-8 shadow-md">
        <p class="mt-6 py-1 px-3 text-xs text-white bg-at-light-green shadow-md rounded-lg">Calculated BMI:</p>
        <p class="mt-4 mb-1 text-center text-xl text-at-light-green">
          <span>
          {{ computeBmi() }}
          </span>
        </p>
      </div>

      <div v-else class="flex flex-col items-center bg-light-grey p-8 shadow-md">
        <p class="mt-6 py-1 px-3 text-xs text-white bg-at-light-green shadow-md rounded-lg">Calculated BMI:</p>
        <p class="mt-8 mb-1 px-10 text-center text-xl text-at-light-green">To get your BMI score you need to update your profile!</p>
      </div>
    </div>

    <div class="w-full flex flex-col items-center">
      <router-link class="mt-6 py-2 px-6 rounded-md  text-xs
            text-white bg-at-light-green duration-200 border-solid
            border-2 border-transparent hover:border-at-light-green hover:bg-white
            hover:text-at-light-green" :to="{ name: 'UpdateProfile', params: {id: user.id} }">
        Update Profile
      </router-link>
    </div>

  </div>

  <div v-if="workouts" class="container px-4 mt-4">
    <div class="grid grid-cols-1 mt-4">
      <p class="mt-6 mb-4 py-1 px-3 text-center text-3xl font-extrabold text-gray-900">Your Workouts:</p>

        <!-- No Workouts -->
        <div v-if="workouts.length === 0" class="w-full flex flex-col items-center">
          <h1 class="text-xl mt-4">Looks like you have not created any workouts!</h1>
          <router-link class="mt-6 py-2 px-6 rounded-md  text-xs
            text-white bg-at-light-green duration-200 border-solid
            border-2 border-transparent hover:border-at-light-green hover:bg-white
            hover:text-at-light-green" :to="{ name: 'Create' }">
            Create Workouts
          </router-link>
        </div>

        <!-- Data -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <router-link class="flex flex-col items-center bg-light-grey p-8 shadow-md cursor-pointer"
                       :to="{ name: 'View-Workout', params: { workoutId: workout.id } }"
                       v-for="(workout, index) in workouts"
                       :key="index">
            <!-- Cardio Img -->
            <img v-if="workout.workoutType === 'cardio'" src="@/assets/images/running-light-green.png" class="h-24 w-auto" alt=""/>

            <!-- Strength Training -->
            <img v-else src="@/assets/images/dumbbell-light-green.png" class="h-24 w-auto" alt=""/>

            <p class="mt-6 py-1 px-3 text-xs text-white bg-at-light-green shadow-md rounded-lg">
              {{ workout.workoutType }}
            </p>

            <h1 class="mt-4 mb-2 text-center text-xl text-at-light-green">
              {{ workout.workoutName }}
            </h1>
          </router-link>
        </div>

    </div>
  </div>

</template>

<script>
import {supabase} from "@/supabase/init";
import {ref} from "vue";
import { uid } from "uid"
import store from "@/store";

export default {
  name: "Profile",
  setup() {
    // Create data / vars
    const user = store.state.user
    const username = ref(null)
    const DOB = ref(null)
    const weight = ref(null)
    const height = ref(null)
    const gender = ref(null)
    const goal = ref(null)
    const avatar_url = ref(null)
    const profileDataLoaded = ref(null)
    const workouts = ref([])

    // Get profile data
    const getProfile = async () => {
      try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select()
            .match({id: user.id})
            .single()
        if(error) throw error
        username.value = profile.username
        DOB.value = profile.DOB
        weight.value = profile.Weight
        height.value = profile.Height
        gender.value = profile.gender
        goal.value = profile.Goal
        avatar_url.value = profile.avatar_url
        profileDataLoaded.value = true
      } catch (error) {
        console.warn(error.message)
      }
    }

    // Get users workouts
    const getWorkouts = async () => {
        const { data, error } = await supabase
            .from('workouts')
            .select()
            .match({belongsTo: user.id})
      workouts.value = data
        if(error) throw error;
    }
    getWorkouts()

    /* Get users age function
       based off their DOB
     */
    const getAge = (dateString) => {
      let today = new Date(), birthDate = new Date(dateString),
      age = today.getFullYear() - birthDate.getFullYear(), m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
      {
        age--;
      }
      return age;
    }

    /*
    Method to compute a users BMI
    based on their details.
     */
    const computeBmi = () => {
      const computedBmi = weight.value / height.value / height.value * 10000
      function roundToTwo(num) {
        return +(Math.round(num + "e+2")  + "e-2");
      }
      return roundToTwo(computedBmi)
    }

    /*
     Generate a random an avatar.
     */
    const getAvatarUrl = () => {
      const avatar = username.value + uid()
      return `https://avatars.dicebear.com/api/big-smile/${avatar}.svg`;
    }


    // Run data function
    getProfile();
    return {username, DOB, avatar_url, weight, height, gender, goal, profileDataLoaded,
      getAge, getAvatarUrl, computeBmi, workouts, user};
  },
};
</script>
