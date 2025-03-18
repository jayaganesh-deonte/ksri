<!-- src/pages/index.vue -->
<template>
  <div class="my-n6 mb-n6 tulipBackground">
    <Contribute class="mt-10" :displayContributeButton="false" />
    <PaymentForm />
  </div>
</template>

<script>
// import PaymentForm from "@/components/PaymentForm.vue";

// export default {
//   components: { PaymentForm },
// };
</script>

<style>
.tulipBackground {
  background-repeat: repeat;
  background-size: auto;
}
</style>
