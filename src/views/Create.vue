<template>
  <div class="max-w-screen-md mx-auto px-4 py-10">
    <!-- Status Message -->
    <div v-if="statusMsg || errorMsg"
        class="mb-10 p-4 bg-light-grey rounded-md shadow-lg">
      <p class="text-at-blue">
        {{ statusMsg }}
      </p>
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <!-- Create -->
    <div class="p-8 flex items-start bg-light-grey rounded-md shadow-lg">
      <!-- Form -->
      <form @submit.prevent="createWorkout" class="flex flex-col gap-y-5 w-full">
        <h1 class="text-2xl text-at-blue">Record Workout</h1>

        <!-- Workout Name -->
        <div class="flex flex-col">
          <label for="workout-name" class="mb-1 text-sm text-at-blue">
            Workout Name
          </label>
          <input type="text" required class="p-2 text-gray-500 focus:outline-none"
              id="workout-name" v-model="workoutName"/>
        </div>

        <!-- Workout Type -->
        <div class="flex flex-col">
          <label for="workout-type" class="mb-1 text-sm text-at-blue">
            Workout Type
          </label>
          <select id="workout-type" class="p-2 text-gray-500 focus:outline-none cursor-pointer" required
              @change="workoutChange" v-model="workoutType">
            <option value="select-workout">Select Workout</option>
            <option value="strength">Strength Training</option>
            <option value="cardio">Cardio</option>
          </select>
        </div>

        <!-- Strength Training Inputs -->
        <div v-if="workoutType === 'strength'" class="flex flex-col gap-y-4">
          <div class="flex flex-col gap-x-6 gap-y-2 relative md:flex-row"
              v-for="(item, index) in exercises" :key="index">
            <div class="flex flex-col md:w-1/3">
              <label for="exercise-name" class="mb-1 text-sm text-at-blue">
                Exercise
              </label>
              <input required type="text" class="p-2 w-full text-gray-500 focus:outline-none" v-model="item.exercise"/>
            </div>
            <div class="flex flex-col flex-1">
              <label for="sets" class="mb-1 text-sm text-at-blue">Sets </label>
              <input required type="text" class="p-2 w-full text-gray-500 focus:outline-none" v-model="item.sets"/>
            </div>
            <div class="flex flex-col flex-1">
              <label for="reps" class="mb-1 text-sm text-at-blue">Reps </label>
              <input required type="text" class="p-2 w-full text-gray-500 focus:outline-none" v-model="item.reps"/>
            </div>
            <div class="flex flex-col flex-1">
              <label for="weight" class="mb-1 text-sm text-at-blue">Weight (LB's)
              </label>
              <input required type="text" class="p-2 w-full text-gray-500 focus:outline-none" v-model="item.weight"/>
            </div>
            <img @click="deleteExercise(item.id)" src="@/assets/images/bin.svg"
                 class="h-4 w-auto absolute -left-5 cursor-pointer" alt=""/>
          </div>
          <button @click="addExercise" type="button" class="mt-6 py-2 px-6 rounded-sm self-start text-sm
              text-white bg-at-blue duration-200 border-solid
              border-2 border-transparent hover:border-at-blue hover:bg-white
              hover:text-at-blue">
            Add Exercise
          </button>
        </div>

        <!-- Cardio Inputs -->
        <div v-if="workoutType === 'cardio'" class="flex flex-col gap-y-4">
          <div class="flex flex-col gap-x-6 gap-y-2 relative md:flex-row" v-for="(item, index) in exercises"
              :key="index">
            <div class="flex flex-col md:w-1/3">
              <label for="cardio-type" class="mb-1 text-sm text-at-blue">
                Type
              </label>
              <select id="cardio-type" class="p-2 w-full text-gray-500 focus:outline-none cursor-pointer" v-model="item.cardioType">
                <option value="#">Select Type</option>
                <option value="run">Runs</option>
                <option value="walk">Walk</option>
              </select>
            </div>
            <div class="flex flex-col flex-1">
              <label for="distance" class="mb-1 text-sm text-at-blue">
                Distance
              </label>
              <input required type="text" class="p-2 w-full text-gray-500 focus:outline-none" v-model="item.distance"
              />
            </div>
            <div class="flex flex-col flex-1">
              <label for="duration" class="mb-1 text-sm text-at-blue">Duration
              </label>
              <input required type="text" class="p-2 w-full text-gray-500 focus:outline-none" v-model="item.duration"/>
            </div>
            <div class="flex flex-col flex-1">
              <label for="pace" class="mb-1 text-sm text-at-blue">Pace </label>
              <input required type="text" class="p-2 w-full text-gray-500 focus:outline-none" v-model="item.pace"/>
            </div>
            <img @click="deleteExercise(item.id)" src="@/assets/images/bin.svg" class="h-4 w-auto absolute -left-5 cursor-pointer" alt=""/>
          </div>
          <button @click="addExercise" type="button" class="mt-6 py-2 px-6 rounded-sm self-start text-sm
                text-white bg-at-blue duration-200 border-solid
                border-2 border-transparent hover:border-at-blue hover:bg-white
                hover:text-at-blue">
            Add Exercise
          </button>
        </div>

        <button type="submit" class="mt-6 py-2 px-6 rounded-sm self-start text-sm
                text-white bg-at-blue duration-200 border-solid
                border-2 border-transparent hover:border-at-blue hover:bg-white
                hover:text-at-blue">
          Record Workout
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import {computed, ref} from "vue"
import { uid } from "uid"
import { supabase } from "../supabase/init"
import store from "@/store";
import {useProgress} from "@marcoschulte/vue3-progress";

export default {
  name: "create",
  setup() {
    // Create data
    const workoutName = ref("");
    const workoutType = ref("select-workout");
    const exercises = ref([]);
    const statusMsg = ref(null);
    const errorMsg = ref(null);
    const user = computed(() => store.state.user)
    let progresses = []

    // Add exercise
    const addExercise = () => {
      if (workoutType.value === "strength") {
        exercises.value.push({
          id: uid(),
          exercise: "",
          sets: "",
          reps: "",
          weight: "",
        })
        return;
      }
      exercises.value.push({
        id: uid(),
        cardioType: "",
        distance: "",
        duration: "",
        pace: "",
      })
    }

    // Delete exercise
    const deleteExercise = (id) => {
      if (exercises.value.length > 1) {
        exercises.value = exercises.value.filter((exercise) => exercise.id !== id);
        return;
      }
      errorMsg.value = "Error: Cannot remove, need to at least have one exercise";
      setTimeout(() => {
        errorMsg.value = false;
      }, 5000);
    };
    // Listens for changing of workout type input
    const workoutChange = () => {
      exercises.value = [];
      addExercise();
    };

    const getUsername = async () => {
      try {
        const {data, error, status} = await supabase
            .from('profiles')
            .select(`username`)
            .match({id: user.value.id})
            .single()
        if(data) return data
        if(error && status !== 406) {
          console.warn(error)
        }
      }
      catch(error) {
        console.warn(error)
      }
    }

    // Create workout
    const createWorkout = async () => {
      if(workoutType.value === "select-workout") {
        errorMsg.value = "Please select a workout type!";
        setTimeout(() => {
          errorMsg.value = null;
        }, 5000);
      }
      else {
        try {
          const progress = useProgress().start();
          progresses.push(progress)
          let username = await getUsername()
          const { error } = await supabase.from("workouts").insert([
            {
              workoutName: workoutName.value,
              workoutType: workoutType.value,
              exercises: exercises.value,
              belongsTo: user.value.id,
              username: username.username
            },
          ]);
          if (error) throw error;
          statusMsg.value = "Success: Workout Created!";
          workoutName.value = null;
          workoutType.value = "select-workout";
          exercises.value = [];
          progresses.pop()?.finish()
          setTimeout(() => {
            statusMsg.value = null;

          }, 5000);
        } catch (error) {
          errorMsg.value = `Error: ${error.message}`;
          progresses.pop()?.finish()
          setTimeout(() => {
            errorMsg.value = null;
          }, 5000);
        }
      }
    };

    return {workoutName, workoutType, exercises, statusMsg,
            errorMsg, addExercise, workoutChange, deleteExercise, createWorkout};
  },
};
</script>
