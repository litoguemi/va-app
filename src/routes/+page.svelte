<h1>Welcome to SvelteKit</h1>

<script>
    import { base } from '$app/paths';
    import { onMount } from 'svelte';

    export let data;

    onMount(async () => {
        const response = await fetch("https://jan-to.github.io/WebDataVis/flights_part.csv")
        flights = await response.json()
    });
</script>

<ul>
    {#each data.flights as flight}
        <li>{flight.from_city}</li>
    {/each}
</ul>