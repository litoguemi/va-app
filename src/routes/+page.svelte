<h1>Welcome to SvelteKit</h1>

<script>
    import { base } from '$app/paths';
    import { onMount } from 'svelte';
  
    let flights = [];
  
    onMount(async () => {
      const response = await fetch(base + "/flights_part.json")
      flights = await response.json()
    });
</script>

<ul>
    {#each flights as flight}
        <li>From {flight.from_city} to {flight.to_city} </li>
    {/each}
</ul>