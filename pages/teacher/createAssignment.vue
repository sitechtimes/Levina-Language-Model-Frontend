<template> 
    <div class="-m-4 flex w-auto flex-col px-4 lg:h-[calc(100vh-4rem)] lg:max-h-[calc(100vh-4rem)] lg:flex-row lg:overflow-y-hidden">
        <form class="flex h-full max-h-full w-full shrink-0 flex-col gap-2 p-4 lg:w-[35rem] lg:overflow-y-scroll">
        <h1 class="text-2xl font-bold">Create Assignment</h1>
        <div class="flex flex-col gap-4">
            <label class="flex flex-col gap-1">
                <span class="font-medium">Assignment Name</span>
                <input 
                type="text" 
                class="du-input w-full border-neutral-400 bg-neutral-200 text-black hover:border-neutral-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-300 dark:hover:border-neutral-300/50" 
                placeholder="Enter assignment name" 
                required
                />
            </label>
            <label class="flex flex-col gap-1">
                <span class="font-medium">Assignment Topic</span>
                <input 
                type="text" 
                class="du-input w-full border-neutral-400 bg-neutral-200 text-black hover:border-neutral-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-300 dark:hover:border-neutral-300/50" 
                placeholder="Grammar Rules" 
                required
                />
            </label>
            <label class="flex flex-col gap-1">
                <span class="font-medium">Number of Questions</span>
                <input 
                type="number" 
                class="du-input w-full border-neutral-400 bg-neutral-200 text-black hover:border-neutral-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-300 dark:hover:border-neutral-300/50" 
                placeholder="10" 
                required 
                />
            </label>
            <label class="flex gap-3">
                <input type="checkbox" class="h-5 w-5" />
                <span class="font-medium">Timed Assignment</span>
            </label>
            <button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">Create Assignment</button>
        </div>
        </form>
    </div>

</template>

<script setup lang="ts">

</script>