<template>
  <footer class="mt-10 bg-at-light-green text-white">
    <section class="container py-5 px-4 flex flex-col gap-4 items-center sm:flex-row">
      <div class="flex items-center gap-x-4">
        <p>&copy; Activity Tracker {{year}}</p>
      </div>
    </section>
  </footer>
</template>

<script>
export default {
  setup() {
    const year = new Date().getFullYear()
    return {year};
  },
};
</script>


