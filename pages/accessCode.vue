<template>
  <div class="flex min-h-screen w-screen flex-col items-center justify-center py-12">
    <h1 class="text-5xl font-bold">Welcome back!</h1>
    <div class="mb-4 flex flex-col items-center justify-center rounded-3xl px-2">
      <h3 class="mb-4">Enter an Access Code for any assignment</h3>

      <form class="flex w-full flex-col items-center justify-center gap-7" @submit.prevent="useAccessCode"> 
        <div class="relative flex flex-col items-start justify-center gap-1">
          <label class="font-medium" for="access-code"> Access Code <span title="Required" class="font-2xl text-red-500">*</span> </label>
          <input id="access-code" v-model="accessCode" class="h-12 w-[22rem] rounded-lg border-0 bg-gray-accent px-4" type="number" required autocomplete="number" />
        </div>

        <div class="relative flex w-96 flex-col items-center justify-center gap-1">
          <button class="w-40 flex justify-center items-center rounded-lg bg-green-accent px-16 py-2 hover:brightness-[0.85]" type="submit"> 
            <span v-if="loading" class="loading du-loading du-loading-sm mt-1"></span>
            <span v-else class="text-lg">Confirm</span>
          </button>
        </div>
        <p v-if="error" class="font-medium text-red-500">Something went wrong. Please try again.</p>
      </form>
    </div>
    <NuxtLink to="/login" class="mt-3 text-neutral-600 dark:text-neutral-200"> Need to sign in with an account? <span class="underline underline-offset-2">Login here. </span></NuxtLink>
  </div>
</template>

<script setup lang="ts">

const accessCode = ref("");
const loading = ref(false);
const error = ref(false);

const route = useRoute();
const router = useRouter();

async function useAccessCode() {
    await router.push("/success");
}

</script>

<style scoped></style>
