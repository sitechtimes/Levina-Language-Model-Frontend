export const useUserStore = defineStore("userStore", () => {
    const isDarkMode = ref(false);
    const showSideMenu = ref(true);

    return {
        isDarkMode,
        showSideMenu
    }
})