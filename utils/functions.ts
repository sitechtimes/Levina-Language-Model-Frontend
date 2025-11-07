/**
 * @warning Be sure to await this function in order to actually use the delay.
 * @param {number} ms - Number of milliseconds to delay.
 * @example await delay(1000); // Wait for 1 second
 */
export function delay(ms: number): Promise<void> {
  return new Promise((executor: any) => setTimeout(executor, ms));
}

/** Returns a random integer between `min` and `max`, inclusive. */
export function getRandomInt(min: number, max: number) {
  const minCeiled: number = Math.ceil(min);
  const maxFloored: number = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

/** Returns a random item from an array. */
export function getRandomItem<T>(arr: T[]) {
  return arr[getRandomInt(0, arr.length - 1)];
}

/**
 * Modifies the current route's query parameters while keeping other existing query parameters.
 *
 * @param query - An object representing the query parameters to add or update.
 * @param replace - Whether to use `router.push` or `router.replace` to change the route. Defaults to `replace`.
 * @example changeRouteQuery({ u: 0 }) -> router.replace({ query: { ...route.query, u: 0 } })
 */
export async function changeRouteQuery<T extends string | number>(query: Record<string, T | T[] | undefined>, method: "replace" | "push" = "replace"): Promise<void> {
  const route = useRoute();
  const router = useRouter();

  if (method === "replace") return void (await router.replace({ query: { ...route.query, ...query } }));
  await router.push({ query: { ...route.query, ...query } });
}