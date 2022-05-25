# Fitness Tracker App

Inspiration for this app came from [Vue 3 & Supabase | Workout Tracker App](https://www.youtube.com/watch?v=3tF0fGkd4ho)
I have taken what I've learnt from this tutorial and many others YT vids along with some material from [Vue School](https://vueschool.io/)
to come up with this Fitness Tracker App.

### Things I want to add to the project
- Profiles Page ADDED
- BMI Calculator ADDED
- Personalised workout section ADDED on profile page
  - Future functionality:
  - add other peoples workouts to your own profile section
- Inspiration Homepage 
- Log in with Github / Google / FB at least one
- Re-design (mobile first)
- Progress Bar ADDED
- Enforce strong password
- Locked be able to delete/edit workout 
that don't belong to the created user

In order to be able to get set up with this project locally you will 
need to sign upto [Supabase](https://supabase.com/) and get 2 keys. 
URL Key and Anon key store this in a env file somewhere safe and update
``
src/supabase/init.js
`` to match your key locations.

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
