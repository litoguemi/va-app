<script>

    import { scaleBand  } from 'd3-scale';
    import { extent } from 'd3-array';
    import { onMount } from 'svelte';
    import Tooltip from './Tooltip.svelte';

   
    let { datapoints = [], x = 'x', y = 'y', xLabel = 'X-Axis', yLabel = 'Y-Axis',
        tooltipData = 'tooltipData', tooltipLabel = 'tooltipLabel',
        updateLineChart='updateLineChart', lineChartKey='lineChartKey',
    } = $props();
    

    // Margins and SVG dimensions
    let margins = { left: 30, top: 30, bottom: 40, right: 30 };
    const width = 600;
    const height = 400;
    const barWidth = 30;

    let [_, maxTotal] = $state (extent(datapoints, d => d[y]));
    let tooltip = $state({ x: 0, y: 0, content: '', visible: false });
    
    // Scale functions
    let scaleX = $state(scaleBand()
        .domain(datapoints.map(d => d[x]))                  
        .range([margins.left, width - margins.right])    
        .padding(0.1));

    let scaleY = $state( (total) => (total / maxTotal) * (height - 50));
    
    onMount(() => {
        if(datapoints.length > 0){
            updateData();
        }
    });
    
    $effect(() => { updateData(); });

    function updateData(){
        [_, maxTotal] = extent(datapoints, d => d[y]);

        // Scale functions
        scaleX = scaleBand()
            .domain(datapoints.map(d => d[x]))                  
            .range([margins.left, width - margins.right])    
            .padding(0.1);

        scaleY = (total) => (total / maxTotal) * (height - 50);
    }

    function handleMouseOver(event, datapoint) {
        
        let toolTipContent = ''; 

        tooltipData.forEach((data, i) => {             
            toolTipContent += `${tooltipLabel[i]} ${datapoint[data]}<br>`;  
        });

        tooltip = {
            x: event.pageX,
            y: event.pageY,
            content: toolTipContent,
            visible: true
        };
        event.target.style.fill = '#066cc2';
    }

    function handleMouseOut(event) {
        tooltip.visible = false;
        event.target.style.fill = 'steelblue';
    }

    function handleFocus(event, datapoint) {
        handleMouseOver(event, datapoint);
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
       
        <rect
            x={scaleX(datapoint[x]) + scaleX.bandwidth() / 2}        
            y={height - scaleY(datapoint[y]) - 20}
            width={barWidth}
            height={scaleY(datapoint[y])}
            fill="steelblue",
            onfocus={(event) => handleFocus(event, datapoint)}
            onblur={(event) => handleBlur(event)}
            onmouseover={(event) => handleMouseOver(event, datapoint)} 
            onmouseout={(event) => handleMouseOut(event)}
            role="img"
            onclick={event => handleClick(event, datapoint)}
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

<Tooltip {...tooltip} />

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


