<script>

    import { scaleLinear } from 'd3-scale';
    import { extent } from 'd3-array';
    import { ticks } from 'd3-array';

    let { datapoints = [], x = 'x', y = 'y', xLabel = 'X-Axis', yLabel = 'Y-Axis' } = $props();
    

    // Margins and SVG dimensions
    let margins = { left: 80, top: 30, bottom: 40, right: 30 };
    const width = 400;
    const height = 200;

    console.log('length:'+datapoints.length+ 'x:'+x+ ' y:'+y);
    

    let xDomain = datapoints.length ? extent(datapoints, (d) => d[x]) : [0, 1];
    let yDomain = datapoints.length ? extent(datapoints, (d) => d[y]) : [0, 1];
    

    // Scale functions
    let xScale = scaleLinear().domain(xDomain).range([margins.left, width - margins.right]);
    let yScale = scaleLinear().domain(yDomain).range([height - margins.bottom, margins.top]);

    const xTicks = ticks(xDomain[0], xDomain[1], 5); 
    const yTicks = ticks(yDomain[0], yDomain[1], 5);

    const originX = xScale(xDomain[0]);
    const originY = yScale(yDomain[0]);

</script>
  
<svg width={width} height={height}>
    {#each datapoints as datapoint}
        <circle cx={xScale(datapoint[x])} 
                cy={yScale(datapoint[y])} 
                r=3
                fill="blue" 
        />
    {/each}


    <!-- x axis -->
    <line x1={margins.left} y1={originY} x2={width - margins.right} y2={originY} />
    {#each xTicks as tick}
        <line x1={xScale(tick)} y1={originY-3} x2={xScale(tick)} y2={originY+3} />
        <text class="x" alignment-baseline="hanging" x={xScale(tick)} y={originY+12}>{tick}</text>
        <line x1={xScale(tick)} y1={margins.top} x2={xScale(tick)} y2={height - margins.bottom} stroke="#ccc" stroke-dasharray="2,2" />
    {/each}
    
    <!-- y axis -->
    <line x1={originX} y1={margins.top} x2={originX} y2={height - margins.bottom} />
    {#each yTicks as tick}
        <line x1={originX-3} y1={yScale(tick)} x2={originX+3} y2={yScale(tick)} />
        <text class="y" alignment-baseline="middle" x={originX-5} y={yScale(tick)}>{tick}</text>
        <line x1={margins.left} y1={yScale(tick)} x2={width - margins.right} y2={yScale(tick)} stroke="#ccc" stroke-dasharray="2,2" />
    {/each}


    <!-- Add axis labels -->
    <text x={(width - margins.left - margins.right) / 2 + margins.left} 
          y={height - 10}  
          class="x-label">
        {xLabel}
    </text>

   
    <text x={-height / 2} 
          y={40}
          transform="rotate(-90)" 
          class="y-label">
        {yLabel}
    </text>
</svg>


<style>
    svg { background-color: whitesmoke }
    circle { opacity: 0.5; }
    line { stroke: black; }
    text { font-size: 12px; }
    text.x { text-anchor: middle; }
    text.y { text-anchor: end; }

    /* Axis label styles */
    .x-label {
        text-anchor: middle;
        font-size: 14px;
        font-weight: bold;
    }

    .y-label {
        text-anchor: middle;
        font-size: 14px;
        font-weight: bold;
    }
</style>