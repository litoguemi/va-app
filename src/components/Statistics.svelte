<!-- Statistics.svelte -->
<script>
    export let number;
    export let measure;
    export let description;
    export let place;
</script>

<style>
    .statistic {
        text-align: center;
        padding: 1rem;
        justify-content: center;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(1, 5, 14, 0.1);
        display: flex; 
        flex-direction: column; 
        justify-content: center; /* Center content vertically */ 
        align-items: center; /* Center content horizontally */
        background-color: white;
    }
    .number-measure { 
        display: flex; 
        align-items: baseline;
    }

    .number {
        font-size: 1.3rem;
        font-weight: bold;
        color: #2c3e50;
    }
    .measure {
        font-size: 0.9rem;
        font-weight: bold;
        color: #2c3e50;
    }
    .description {
        font-size: 1.1rem;
        color: #16474b;
        margin-top: 0.5rem;
    }
    .place {
        font-size: 1.3rem;
        font-weight: bold;
        color: #2c3e50;
    }
    
</style>

<div class="statistic">
    <div class="place">{place}</div>        
    <div class="description">{description}</div>  
    <div class="number-measure"> 
        <div class="number">{number}</div> 
        <div class="measure">{measure}</div> 
    </div>    
</div>
