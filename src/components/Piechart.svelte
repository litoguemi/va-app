<script>

    import { onMount } from 'svelte';

    let slices = $state([]);
    let { groupedData = [], title='title', palette='palette'} = $props();
    
    // Margins and SVG dimensions
    let margins = { left: 10, top: 5, bottom: 20, right: 10 };
    const width = 170;
    const height = 200;
    const radius = Math.min(width, height) / 2 - Math.max(margins.left, margins.right);
    
    let colors = ['#86A69D', '#7ea8be', '#98b0a9', '#d8cc86', '#c2948a', '#71BBB2'];
    const colorage = ['#9C4137','#E2D8A6', '#A68438', '#ABAA38', '#D5907B'];
    const colorgen = ['#D5907B', '#86A69D', '#98b0a9', '#d8cc86', '#c2948a', '#71BBB2'];    
    const coloraco = ['#B09E3F' , '#C6B55C', '#D4C781', '#E2D8A6', '#EFE9CC'];
    const colortra = ['#86A69D', '#D5907B', '#77B6D1', '#7A9ED3', '#7D86D5'];

    onMount(() => {
        updateData();         
    });
    
    $effect(() => { updateData(); });

    function updateData(){

        //Paletter definition
        if (palette == 'age') {
            colors = colorage;        
        } else if (palette == 'gender') {
            colors = colorgen;        
        } else if (palette == 'accommodation') {
            colors = coloraco;                
        } else if (palette == 'transportation') {
            colors = colortra;        
        }else {
            colors = colors;        
        }

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
                    color: colors[i],
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
        <path d={path} fill={color} stroke="white" stroke-width="1">            
        </path> 
        <text fill="black" font-size="16" dy="0.35em" text-anchor="middle" 
            x = {midX}
            y = {midY}>
            {label} 
        </text> 
    {/each} 
</svg>



