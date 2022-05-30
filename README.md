# Fitness Tracker App

Inspiration for this app came from [Vue 3 & Supabase | Workout Tracker App](https://www.youtube.com/watch?v=3tF0fGkd4ho)
I have taken what I've learnt from this tutorial and many others 
YT videos along with some material from [Vue School](https://vueschool.io/)
to come up with this Fitness Tracker App.

### Things I want/have added to this project
- Profiles Page **(ADDED)**
- BMI Calculator **(ADDED)**
- Personalised workout section **(ADDED on profile page)**
  - add other peoples workouts to your own profile section (Future upgrade)
- Inspiration Homepage (Lost inspiration to do this :rofl:)
- Log in with Github / Google / FB at least one **(TODO)**
- Re-design (mobile first) **(ADDED decided to stick with Tailwind CSS...)**
- Progress Bar ADDED **(ADDED)**
Progress bar taken from:- [Awesome Vue](https://awesome-vue.js.org/components-and-libraries/ui-components.html#progress-bar) specifically
this one [Vue 3 Progress Bar](https://github.com/marcoschulte/vue3-progress)
- Enforce strong password **(ADDED)**
- Lock workouts, only be able to delete/edit workout 
that belong to the created user **(ADDED)**

In order to be able to get set up with this project locally you will 
need to sign upto [Supabase](https://supabase.com/) and get 2 keys. 
URL Key and Anon key store this in a env file somewhere safe and update
``
src/supabase/init.js
`` to match your key locations.

A database dump has been included with this project.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```


### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
