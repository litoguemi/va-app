<script>

    import { scaleBand  } from 'd3-scale';
    import { extent } from 'd3-array';


    let { datapoints = [], x = 'x', y = 'y', xLabel = 'X-Axis', yLabel = 'Y-Axis' } = $props();
    

    // Margins and SVG dimensions
    let margins = { left: 30, top: 30, bottom: 40, right: 30 };
    const width = 600;
    const height = 400;
    const barWidth = 30;

    console.log('lengthB:'+datapoints.length+ 'x:'+x+ ' y:'+y);


    const [_, maxTotal] = extent(datapoints, d => d[y]);

    // Scale functions
    const scaleX = scaleBand()
        .domain(datapoints.map(d => d[x]))                  
        .range([margins.left, width - margins.right])    
        .padding(0.1);

    const scaleY = (total) => (total / maxTotal) * (height - 50);

</script>

<svg width={width} height={height}>
    {#each datapoints as datapoint, i}
        
        <rect
            x={scaleX(datapoint[x]) + scaleX.bandwidth() / 2}        
            y={height - scaleY(datapoint[y]) - 20}
            width={barWidth}
            height={scaleY(datapoint[y])}
            fill="steelblue"
        />
        
        <!-- Labels for places below each bar -->
        {#if scaleY(datapoint[y]) >= height / 2}
            <text
                x={scaleX(datapoint[x]) + (scaleX.bandwidth() / 2) + (barWidth / 2)}
                y={height - 30}
                transform={`rotate(-90, ${scaleX(datapoint[x]) + (scaleX.bandwidth() / 2) + (barWidth / 2)}, ${height - 30})`}
                font-size="15">
                {datapoint[x]}
            </text>
        {:else}
            <text
                x={scaleX(datapoint[x]) + (scaleX.bandwidth() / 2) + (barWidth / 2)}
                y={height - scaleY(datapoint[y]) - 50}
                transform={`rotate(-90, ${scaleX(datapoint[x]) + (scaleX.bandwidth() / 2) + (barWidth / 2)}, ${height - scaleY(datapoint[y]) - 50})`}
                font-size="15">
                {datapoint[x]}
            </text>
        {/if}

        <!-- Labels for total amount at the top of each bar -->
        <text
            x={scaleX(datapoint[x]) + (scaleX.bandwidth() / 2) + (barWidth / 2)  }
            y={height - scaleY(datapoint[y]) - 30}
            text-anchor="middle"
            font-size="12"
            fill="black"
        >
            ${datapoint[y].toFixed(2)}K
        </text>
    {/each}


    <!-- Add axis labels -->
    <text x={(width - margins.left - margins.right) / 2 + margins.left} 
          y={height - 2}  
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


