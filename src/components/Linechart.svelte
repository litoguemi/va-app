<script>
  import { scalePoint, scaleLinear, scaleBand } from 'd3-scale';
  import { extent, ticks } from 'd3-array';
  import { onMount } from 'svelte';
  import Tooltip from './Tooltip.svelte';

  export let datapoints = [];
  export let x = 'x';
  export let y = [];
  export let xLabel = 'X-Axis';
  export let yLabel = 'Y-Axis';
  export let tooltip = { x: 0, y: 0, content: '', visible: false };
  export let tooltiplabel = [];
  export let linecolor=[];
  export let width = 350;
  export let height = 220;

  // Chart dimensions
  let margins = { left: 40, top: 30, bottom: 50, right: 20 };
  
  

  let scaleX, scaleY, paths;
  let xTicks, yTicks;
  

  function updateData() {
    // Flatten the array to get all values for y-axis
    let yValues = datapoints.flatMap(d => y.map(prop => d[prop]));
    let [minTotal, maxTotal] = extent(yValues);
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

    // Path data for the lines
    paths = y.map(prop => 
      datapoints.map((d, i) => {
        const xVal = scaleX(d[x]) + scaleX.bandwidth() / 2;
        const yVal = scaleY(d[prop]);
        return `${i === 0 ? 'M' : 'L'}${xVal},${yVal}`;
      }).join(' ')
    );

  }

  function handleMouseOver(event, datapoint) {
        
        //let toolTipContent = ''; 
        let toolTipContent = tooltiplabel[0] + (datapoint).toFixed(1) + tooltiplabel[1];
        
        tooltip = {
            x: event.pageX,
            y: event.pageY,
            content: toolTipContent,
            visible: true
        };
        event.target.style.opacity = '50%';
  }

  function handleMouseOut(event) {
        tooltip.visible = false;
        event.target.style.opacity = '100%';
  }

  function handleFocus(event, datapoint) {
      handleMouseOver(event, datapoint);
  }

  function handleBlur(event) {
      handleMouseOut(event);
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


  <svg {width} {height}>
    <!-- X-Axis -->
    <line x1={margins.left} y1={height - margins.bottom} x2={width - margins.right} y2={height - margins.bottom} stroke="black" />
    {#each datapoints as data, i}
      <text x={scaleX(data[x]) + scaleX.bandwidth() / 2} y={height - margins.bottom + 15} text-anchor="middle" font-size="12">{data[x]}</text>
    {/each}
    <text x={width / 2} y={height - 5} text-anchor="middle" font-size="16">{xLabel}</text>

    <!-- Y-Axis -->
    <line x1={margins.left} y1={margins.top} x2={margins.left} y2={height - margins.bottom} stroke="black" />
    {#each yTicks as tick}
      <line x1={margins.left} y1={scaleY(tick)} x2={width - margins.right} y2={scaleY(tick)} stroke="#e0e0e0" stroke-dasharray="2,2" />
      <line x1={margins.left - 5} y1={scaleY(tick)} x2={margins.left} y2={scaleY(tick)} stroke="black" />
      <text x={margins.left - 10} y={scaleY(tick) + 5} text-anchor="end" font-size="12">{tick}</text>
    {/each}
    <text x={-height / 2} y={15} transform="rotate(-90)" text-anchor="middle" font-size="15">{yLabel}</text>

    
    <!-- Line Paths -->
    {#each paths as path, index}
      <path d={path} fill="none" stroke={linecolor[index]} stroke-width="2" />
    {/each}

    <!-- Data Points -->
    {#each datapoints as data}
      {#each y as prop, index}
        <circle cx={scaleX(data[x]) + scaleX.bandwidth() / 2} 
                cy={scaleY(data[prop])} 
                r="4" 
                fill={linecolor[index]} 
                onfocus={(event) => handleFocus(event, data[prop])}
                onblur={(event) => handleBlur(event)}
                onmouseover={(event) => handleMouseOver(event, data[prop])} 
                onmouseout={(event) => handleMouseOut(event)}
                role="img"/>
      {/each}
    {/each} 

  </svg>


<Tooltip {...tooltip} />

<style>
  
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
