<template>
  <div>
    {{username}}
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
  data() {
    return {
       username: localStorage.getItem('username')
    }
  },
  setup() {
    // Create data / vars

    // Get data

    // Run data function

    return {};
  },
};
</script>
