<h1>Welcome to SvelteKit About</h1>


<script>
  import { page } from '$app/stores';
  import { scaleLinear } from 'd3-scale';
  import { extent } from 'd3-array';
  import { ticks } from 'd3-array';
 
  
  const datapoints = $page.data.flowers || [];
   
  let margins = {left: 80, top: 30, bottom: 40, right: 30}
  
  let xDomain = datapoints.length ? extent(datapoints, (d) => d.sepal_length) : [0, 1];
  let yDomain = datapoints.length ? extent(datapoints, (d) => d.sepal_width) : [0, 1];
 

  let xScale = scaleLinear().domain(xDomain).range([margins.left,300-margins.right])
  let yScale = scaleLinear().domain(yDomain).range([300 - margins.bottom, margins.top]);
  
  const xTicks = ticks(xDomain[0], xDomain[1], 5); 
  const yTicks = ticks(yDomain[0], yDomain[1], 5);

  const originX = xScale(xDomain[0]);
  const originY = yScale(yDomain[0]);

</script>
  
<svg width=300 height=300>
  {#each datapoints as datapoint}
    <circle cx={xScale(datapoint.sepal_length)} 
            cy={yScale(datapoint.sepal_width)} 
            r=5
            fill="blue" 
    />
  {/each}
  
  <!-- x axis -->
  <line x1={margins.left} y1={originY} x2={300 - margins.right} y2={originY} />
  {#each xTicks as tick}
    <line x1={xScale(tick)} y1={originY-3} x2={xScale(tick)} y2={originY+3} />
    <text class="x" alignment-baseline="hanging" x={xScale(tick)} y={originY+12}>{tick}</text>
    <line x1={xScale(tick)} y1={margins.top} x2={xScale(tick)} y2={300 - margins.bottom} stroke="#ccc" stroke-dasharray="2,2" />
  {/each}
  
  <!-- y axis -->
  <line x1={originX} y1={margins.top} x2={originX} y2={300 - margins.bottom} />
  {#each yTicks as tick}
    <line x1={originX-3} y1={yScale(tick)} x2={originX+3} y2={yScale(tick)} />
    <text class="y" alignment-baseline="middle" x={originX-5} y={yScale(tick)}>{tick}</text>
    <line x1={margins.left} y1={yScale(tick)} x2={300 - margins.right} y2={yScale(tick)} stroke="#ccc" stroke-dasharray="2,2" />
  {/each}


  <!-- Add axis labels -->
  <text x={150} y={295} text-anchor="middle">Sepal Length (cm)</text>
  <text transform="rotate(-90)" x={-150} y={50} text-anchor="middle">Sepal Width (cm)</text>
</svg>

<style>
  svg { background-color: whitesmoke }
  circle { opacity: 0.5; }
  line { stroke: black; }
  text { font-size: 12px; }
  text.x { text-anchor: middle; }
  text.y { text-anchor: end; }
</style>