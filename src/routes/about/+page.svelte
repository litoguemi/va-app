<h1>Welcome to SvelteKit About</h1>


<script>
  export let data;
</script>

<ul>
  {#each data.flowers as flower}
  <li>{flower.sepalLength}</li>
  {/each}
</ul>