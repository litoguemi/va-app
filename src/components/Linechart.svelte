<script>
  import { scalePoint, scaleLinear, scaleBand } from 'd3-scale';
  import { extent, ticks } from 'd3-array';
  import { onMount } from 'svelte';

  export let datapoints = [];
  export let x = 'x';
  export let y = 'y';
  export let xLabel = 'X-Axis';
  export let yLabel = 'Y-Axis';

  // Chart dimensions
  let margins = { left: 40, top: 30, bottom: 50, right: 20 };
  const width = 600;
  const height = 220;

  let scaleX, scaleY, linePath;
  let xTicks, yTicks;

  function updateData() {
    let [minTotal, maxTotal] = extent(datapoints, d => d[y]);
    const yBuffer = (maxTotal - minTotal) * 0.2; // 20% buffer
    const yDomain = [minTotal - yBuffer, maxTotal + yBuffer];
    const xDomain = extent(datapoints, d => d[x]);

    // Scale functions
    scaleX = scaleBand()
      .domain(datapoints.map(d => d[x]))
      .range([margins.left, width - margins.right])
      .padding(0.1);

    scaleY = scaleLinear()
      .domain(yDomain)
      .range([height - margins.bottom, margins.top]);

    // Calculate ticks
    xTicks = ticks(xDomain[0], xDomain[1], 5);
    yTicks = ticks(yDomain[0], yDomain[1], 5);

    // Path data for the line
    linePath = datapoints.map((d, i) => {
      const xVal = scaleX(d[x]) + scaleX.bandwidth() / 2;
      const yVal = scaleY(d[y]);
      return `${i === 0 ? 'M' : 'L'}${xVal},${yVal}`;
    }).join(' ');
  }

  onMount(() => {
    if (datapoints.length > 0) {
      updateData();
    }
  });

  $: if (datapoints.length > 0) {
    updateData();
  }
</script>

{#if datapoints.length > 0}
  <svg {width} {height} style="border: 1px solid #ccc;">
    <!-- X-Axis -->
    <line x1={margins.left} y1={height - margins.bottom} x2={width - margins.right} y2={height - margins.bottom} stroke="black" />
    {#each datapoints as data, i}
      <text x={scaleX(data[x]) + scaleX.bandwidth() / 2} y={height - margins.bottom + 15} text-anchor="middle" font-size="12">{data[x]}</text>
    {/each}
    <text x={width / 2} y={height - 5} text-anchor="middle" font-size="15">{xLabel}</text>

    <!-- Y-Axis -->
    <line x1={margins.left} y1={margins.top} x2={margins.left} y2={height - margins.bottom} stroke="black" />
    {#each yTicks as tick}
      <line x1={margins.left - 5} y1={scaleY(tick)} x2={margins.left} y2={scaleY(tick)} stroke="black" />
      <text x={margins.left - 10} y={scaleY(tick) + 5} text-anchor="end" font-size="12">{tick}</text>
    {/each}
    <text x={-height / 2} y={15} transform="rotate(-90)" text-anchor="middle" font-size="15">{yLabel}</text>

    <!-- Line Path -->
    <path d={linePath} fill="none" stroke="steelblue" stroke-width="2" />

    <!-- Data Points -->
    {#each datapoints as data}
      <circle cx={scaleX(data[x]) + scaleX.bandwidth() / 2} 
              cy={scaleY(data[y])} 
              r="4" 
              fill="orange" />
    {/each}
  </svg>
{/if}


<style>
  svg { 
      border: 1px solid black; 
      box-shadow: 0 10px 10px rgba(1, 5, 14, 0.1);
  }
  
  /* Axis label styles */
  .x-label {
      text-anchor: middle;
      font-size: 16px;
      font-weight: bold;
  }

  .y-label {
      text-anchor: middle;
      font-size: 16px;
      font-weight: bold;
  }
</style>
