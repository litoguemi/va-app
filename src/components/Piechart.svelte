<script>

    import { onMount } from 'svelte';

    let slices = $state([]);
    let { groupedData = [], title='title'} = $props();
    

    // Margins and SVG dimensions
    let margins = { left: 30, top: 30, bottom: 40, right: 30 };
    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2 - Math.max(margins.left, margins.right);
    
    console.log('lengthPiegroupedData:'+groupedData.length);

    onMount(() => {

        const colors = ['#D8A25E', '#36A2EB', '#344966', '#BFCC94', '#E6AACE']; 
        
        //Suffle colors
        colors.sort(() => Math.random() - 0.5);

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
                    color: colors[i % colors.length],
                    midX: width / 2 + (radius / 2) * Math.cos(midAngle), 
                    midY: height / 2 + (radius / 2) * Math.sin(midAngle)
                    };
        }); 
    });                    
</script>

<svg width={width} height={height}>

    <text   x={width / 2} 
            y={height - (margins.bottom / 4)} 
            text-anchor="middle" 
            font-size="24" fill="black"> 
        {title}
    </text> 
    
    {#each slices as { path, label, color,midX, midY }, i} 
        <path d={path} fill={color} stroke="white" stroke-width="2"></path> 
        <text fill="black" font-size="20" dy="0.35em" text-anchor="middle" 
            x = {midX}
            y = {midY}>
            {label} 
        </text> 
    {/each} 
</svg>




