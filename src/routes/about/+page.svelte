<script>
  export let data;
</script>

<ul>
  {#each data.flowers as flower}
    <li>{flower.sepalLength}</li>
  {/each}
</ul>