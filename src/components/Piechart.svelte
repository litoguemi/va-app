<script>

    import { onMount } from 'svelte';
    import Tooltip from './Tooltip.svelte';

    let slices = $state([]);
    let { groupedData = [], title='title'} = $props();
    let tooltip = $state({ x: 0, y: 0, content: '', visible: false });

    // Margins and SVG dimensions
    let margins = { left: 10, top: 5, bottom: 20, right: 10 };
    const width = 170;
    const height = 200;
    const radius = Math.min(width, height) / 2 - Math.max(margins.left, margins.right);
    
    const colors = ['#6ABCFD', '#4C7B8B', '#c6f2af', '#d8cc86', '#dea576']; 

    //Suffle colors
    colors.sort(() => Math.random() - 0.5);

    onMount(() => {
        updateData();         
    });
    
    $effect(() => { updateData(); });

    function updateData(){

        console.log('lengthPiegroupedData:'+groupedData.length);

        const chartData = Object.keys(groupedData).map(key => ({ 
            label: key, 
            value: groupedData[key] 
        }));

        const total = chartData.reduce((sum, item) => sum + item.value, 0); 
        let startAngle = 0;

        slices = chartData.map((d, i) => { 
            const sliceAngle = (d.value / total) * 2 * Math.PI; 
            const endAngle = startAngle + sliceAngle; 
            
            const x1 = width / 2 + radius * Math.cos(startAngle); 
            const y1 = height / 2 + radius * Math.sin(startAngle); 
            const x2 = width / 2 + radius * Math.cos(endAngle); 
            const y2 = height / 2 + radius * Math.sin(endAngle);

            const largeArcFlag = sliceAngle > Math.PI ? 1 : 0; 
            
            const pathData = `  M ${width / 2} ${height / 2} 
                                L ${x1} ${y1} 
                                A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} 
                                Z `;

            // Calculate the midpoint angle
            const midAngle = startAngle + sliceAngle / 2;
            startAngle = endAngle; 
            
            return { path: pathData, 
                    label: d.label,
                    value: d.value, 
                    color: colors[i % colors.length],
                    midX: width / 2 + (radius / 2) * Math.cos(midAngle), 
                    midY: height / 2 + (radius / 2) * Math.sin(midAngle)
                    };
        });
    }
    
    // Function to split the title into multiple lines
    function splitTitle(title) {
        const maxLength = 20;
        const words = title.split(' ');
        const lines = [];
        let currentLine = '';

        words.forEach(word => {
        if ((currentLine + word).length > maxLength) {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
        } else {
            currentLine += word + ' ';
        }
        });

        if (currentLine.trim().length > 0) {
        lines.push(currentLine.trim());
        }

    return lines;
  }

    function darkenColor(color) {
        const amount = -20; // Adjust this value to control the amount of darkening
        let r = parseInt(color.slice(1, 3), 16) + amount;
        let g = parseInt(color.slice(3, 5), 16) + amount;
        let b = parseInt(color.slice(5, 7), 16) + amount;

        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));

        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    }
    
    function handleMouseOver(event, color, value) {
        let toolTipContent = value; 

        tooltip = {
            x: event.pageX,
            y: event.pageY,
            content: toolTipContent,
            visible: true
        };

        event.target.style.fill = darkenColor(color);  // Darken the color
    }

    function handleMouseOut(event, color) {
        tooltip.visible = false;
        event.target.style.fill = color;
    }

    function handleFocus(event, color, value) {
        handleMouseOver(event, color, value);
    }

    function handleBlur(event, color) {
        handleMouseOut(event, color);
    }

  const titleLines = splitTitle(title);
</script>

<svg width={width} height={height}>
    {#each titleLines as line, index}
        <text x={width / 2} 
            y={height - (margins.bottom / 4) + (index * 25)}
            text-anchor="middle" 
            font-size="20" 
            fill="black">
        {line}
        </text>
    {/each}
    
    {#each slices as { path, label, value, color,midX, midY }, i} 
        <path d={path} fill={color} stroke="white" stroke-width="2"
            onfocus={(event) => handleFocus(event, color, value)}
            onblur={(event) => handleBlur(event, color)}
            onmouseover={(event) => handleMouseOver(event, color, value)} 
            onmouseout={(event) => handleMouseOut(event, color)}
            role="img">            
        </path> 
        <text fill="black" font-size="16" dy="0.35em" text-anchor="middle" 
            x = {midX}
            y = {midY}>
            {label} 
        </text> 
    {/each} 
</svg>

<Tooltip {...tooltip} />



