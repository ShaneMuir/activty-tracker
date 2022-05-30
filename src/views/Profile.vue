<template>
  <h2 v-if="profileDataLoaded" class="mt-6 text-at-blue text-center text-3xl font-extrabold">Profile Page</h2>
  <div v-if="profileDataLoaded" class="container mt-6 px-4">
    <!-- Profile -->
    <div class="grid grid-cols-2 gap-6">
      <div class="flex flex-col items-center bg-light-grey p-8 shadow-md">
        <!-- Profile Img -->
        <img v-if="avatar_url" :src="avatar_url" class="h-20 w-auto" alt=""/>
        <img v-else :src="getAvatarUrl()" class="h-20 w-auto" alt="">

        <p class="mt-1 mb-4 py-1 px-3 text-xxl text-white bg-at-blue shadow-md rounded-lg">
          {{ username }}
        </p>
        <p v-if="DOB" class="mt-1 mb-1 text-center text-xl text-at-blue">Age:
        <span>
          {{ getAge(DOB) }}
        </span>
        </p>
        <p v-if="weight" class="mt-1 mb-1 text-center text-xl text-at-blue">Weight:
        <span>
          {{ weight }}kg
        </span>
        </p>
        <p v-if="height" class="mt-1 mb-1 text-center text-xl text-at-blue">Height:
        <span>
          {{ height }}cm
        </span>
        </p>
        <div v-if="goal" class="goal-wrapper">
          <p class="mt-1 mb-1 text-center text-xl text-at-blue">Goal:
          <span>
            {{ goal }}
          </span>
          </p>
        </div>

        <div class="grid grid-cols-2 gap-10">
          <router-link class="mt-6 py-2 px-6 rounded-md  text-xs
            text-white bg-at-blue duration-200 border-solid
            border-2 border-transparent hover:border-at-blue hover:bg-white
            hover:text-at-blue" :to="{ name: 'UpdateProfile', params: {id: user.id} }">
            Update Profile
          </router-link>

            <router-link class="mt-6 py-2 px-6 rounded-md  text-xs
            text-white bg-at-blue duration-200 border-solid
            border-2 border-transparent hover:border-at-blue hover:bg-white
            hover:text-at-blue" :to="{ name: 'NewPassword' }">
            New Password
            </router-link>
        </div>
      </div>

      <div v-if="computedBmi" class="flex flex-col justify-center items-center bg-light-grey p-8 shadow-md">
        <div v-if="computedBmi < 18.5" class="underweight">
          <p class="mt-1 mb-4 py-1 text-center px-3 text-2xl text-at-blue">Based on your BMI score we consider you to be underweight</p>
          <img src="../assets/images/sad-face.svg" class="h-20 w-full" alt=""/>
        </div>

        <div v-else-if="computedBmi > 18.5 && computedBmi < 26" class="normal-weight">
          <p class="mt-1 mb-4 py-1 text-center px-3 text-2xl text-at-blue">Based on your BMI score we consider you to be an normal weight</p>
          <img src="../assets/images/smiley.svg" class="h-20 w-full" alt=""/>
        </div>

        <div v-else-if="computedBmi > 26 && computedBmi < 36" class="over-weight">
          <p class="mt-1 mb-4 py-1 text-center px-3 text-2xl text-at-blue">Based on your BMI score we consider you to be an over weight</p>
          <img src="../assets/images/straight-face.svg" class="h-20 w-full" alt=""/>
        </div>

        <div v-else-if="computedBmi > 36.1" class="over-weight">
          <p class="mt-1 mb-4 py-1 text-center px-3 text-2xl text-at-blue">Based on your BMI score we consider you to be an obese</p>
          <img src="../assets/images/sad-face.svg" class="h-20 w-full" alt=""/>
        </div>

        <p class="mt-10 py-1 px-3 text-xxl text-white bg-at-blue shadow-md rounded-lg">Calculated BMI:
          <span>
            {{computedBmi}}
          </span>
        </p>
      </div>

      <div v-else class="flex flex-col items-center bg-light-grey p-8 shadow-md">
        <p class="mt-6 py-1 px-3 text-xs text-white bg-at-blue shadow-md rounded-lg">Calculated BMI:</p>
        <p class="mt-8 mb-1 px-10 text-center text-xl text-at-blue">To get your BMI score you need to update your profile!</p>
      </div>
    </div>

  </div>

  <div v-if="workouts" class="container px-4 mt-4">
    <div class="grid grid-cols-1 mt-4">
      <p class="mt-6 mb-4 py-1 px-3 text-center text-3xl font-extrabold text-at-blue">Your Workouts:</p>

        <!-- No Workouts -->
        <div v-if="workouts.length === 0" class="w-full flex flex-col items-center">
          <h1 class="text-xl mt-4">Looks like you have not created any workouts!</h1>
          <router-link class="mt-6 py-2 px-6 rounded-md  text-xs
            text-white bg-at-blue duration-200 border-solid
            border-2 border-transparent hover:border-at-blue hover:bg-white
            hover:text-at-blue" :to="{ name: 'Create' }">
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
            <img v-if="workout.workoutType === 'cardio'" src="@/assets/images/running-blue.svg" class="h-16 w-auto" alt=""/>

            <!-- Strength Training -->
            <img v-else src="@/assets/images/dumbell-blue.svg" class="h-16 w-auto" alt=""/>

            <p class="mt-6 py-1 px-3 text-xs text-white bg-at-blue shadow-md rounded-lg">
              {{ workout.workoutType }}
            </p>

            <h1 class="mt-4 mb-2 text-center text-xl text-at-blue">
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
    const goal = ref(null)
    const avatar_url = ref(null)
    const profileDataLoaded = ref(null)
    const workouts = ref([])
    const computedBmi = ref(null)

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
        goal.value = profile.Goal
        avatar_url.value = profile.avatar_url
        profileDataLoaded.value = true
        const bmi = weight.value / height.value / height.value * 10000
        computedBmi.value = Math.round(bmi * 1e2) / 1e2

      } catch (error) {
        console.warn(error.message)
      }
    }
    getProfile();

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
     Generate a random an avatar.
     */
    const getAvatarUrl = () => {
      const avatar = username.value + uid()
      return `https://avatars.dicebear.com/api/big-smile/${avatar}.svg`;
    }

    return {username, DOB, avatar_url, weight, height, goal, profileDataLoaded,
      getAge, getAvatarUrl, workouts, user, computedBmi};
  },
};
</script>
