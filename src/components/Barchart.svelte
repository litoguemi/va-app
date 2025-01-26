<script>

    import { scaleBand  } from 'd3-scale';
    import { extent } from 'd3-array';
    import { onMount } from 'svelte';
    import Tooltip from './Tooltip.svelte';

   
    let { datapoints = [], x = 'x', y = 'y', xLabel = 'X-Axis', yLabel = 'Y-Axis',
        tooltipData = 'tooltipData', tooltipLabel = 'tooltipLabel',
        updateLineChart='updateLineChart', lineChartKey='lineChartKey',
        barcolor=[], legends=[]
    } = $props();
    

    // Margins and SVG dimensions
    let margins = { left: 0, top: 30, bottom: 50, right: 20 };
    const width = 700;
    const height = 350;
    const barWidth = 30;

    let [_, maxTotal] = $state (extent(datapoints, d => getTotalValues(d, y)));
    let tooltip = $state({ x: 0, y: 0, content: '', visible: false });
    
    // Scale functions
    let scaleX = $state(scaleBand()
        .domain(datapoints.map(d => d[x]))                  
        .range([margins.left, width - margins.right])    
        .padding(0.05));

    let scaleY = $state( (total) => (total / maxTotal) * (height - margins.bottom));
    
    onMount(() => {
        if(datapoints.length > 0){
            updateData();
        }
    });
    
    $effect(() => { updateData(); });

    function updateData(){
        [_, maxTotal] = extent(datapoints, d => getTotalValues(d, y));

        // Scale functions
        scaleX = scaleBand()
            .domain(datapoints.map(d => d[x]))                  
            .range([margins.left, width - margins.right])    
            .padding(0.05);

        scaleY = (total) => (total / maxTotal) * (height - margins.bottom);
    }

    function getTotalValues(datapoint, keys) {
        let total = 0;
        keys.forEach((key) => {
            total += datapoint[key];
        });
        return total;
    }

    function handleMouseOver(event, value, label) {
        
        let toolTipContent = ''; 

        toolTipContent += `${label} $${value}<br>`;  
      
        tooltip = {
            x: event.pageX,
            y: event.pageY,
            content: toolTipContent,
            visible: true
        };
        event.target.style.opacity = '70%';
    }

    function handleMouseOut(event) {
        tooltip.visible = false;
        event.target.style.opacity = '100%';
    }

    function handleFocus(event, value, label) {
        handleMouseOver(event, value, label);
    }

    function handleBlur(event) {
        handleMouseOut(event);
    }

    function handleClick(event, datapoint) { 
        console.log('Clicked on bar',JSON.stringify(datapoint));
        handleBlur(event);
        updateLineChart(datapoint[lineChartKey]);         
    }

</script>

<svg width={width} height={height}>
    {#each datapoints as datapoint, i}

        {#each y as key, index}
            <rect
                x={scaleX(datapoint[x]) + scaleX.bandwidth() / 2}
                y={height - scaleY(getTotalValues(datapoint, y.slice(0, index + 1))) - 28}
                width={barWidth}
                height={scaleY(datapoint[key])}
                fill={barcolor[index]}
                onfocus={(event) => handleFocus(event,datapoint[key],tooltipLabel[index])}
                onblur={(event) => handleBlur(event)}
                onmouseover={(event) => handleMouseOver(event,datapoint[key],tooltipLabel[index])}
                onmouseout={(event) => handleMouseOut(event)}
                role="img"
                onclick={(event) => handleClick(event, datapoint,datapoint[key],tooltipLabel[index])}
            />
        {/each}
       
        <!-- Labels for places below each bar -->
        {#if scaleY(getTotalValues(datapoint, y)) >= height / 2}
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
                y={height - scaleY(getTotalValues(datapoint, y)) - 50}
                transform={`rotate(-90, ${scaleX(datapoint[x]) + (scaleX.bandwidth() / 2) + (barWidth / 2)}, ${height - scaleY(getTotalValues(datapoint, y)) - 50})`}
                font-size="15">
                {datapoint[x]}
            </text>
        {/if}

        <!-- Labels for total amount at the top of each bar -->
        <text
            x={scaleX(datapoint[x]) + (scaleX.bandwidth() / 2) + (barWidth / 2)  }
            y={height - scaleY(getTotalValues(datapoint, y)) - 30}
            text-anchor="middle"
            font-size="12"
            fill="black"
        >
            ${(getTotalValues(datapoint, y) / 1000).toFixed(2)}K
        </text>
    {/each}

    <!-- Add axis labels -->
    <text x={(width - margins.left - margins.right) / 2 + margins.left} 
          y={height - 10}  
          class="x-label">
        {xLabel}
    </text>

    {#each legends as legend, index}
        <g transform={`translate(${margins.left + 20}, ${margins.top + index * 20})`}>
            <rect width="15" height="15" fill={barcolor[(legends.length - 1) - index]} />
            <text x="20" y="12" font-size="12">{legend}</text>
        </g>
    {/each}
</svg>

<Tooltip {...tooltip} />

<style>
    svg { 
        border: 1px solid #ccc; 
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


