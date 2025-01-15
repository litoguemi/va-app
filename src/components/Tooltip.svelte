<style>
    .tooltip {
        position: absolute;
        background-color: #333;
        color: #fff;
        padding: 5px;
        border-radius: 3px;
        pointer-events: none;
        font-size: 15px;
        transform: translate(-50%, -120%);
        opacity: 0; 
        transition: opacity 0.5s ease-in-out;
    }
    .tooltip.visible { 
        opacity: 1; 
    }
</style>

<div class="tooltip {visible ? 'visible' : ''}" style="top: {y}px; left: {x}px; display: {visible ? 'block' : 'none'};">
    {@html content}
</div>

<script>
    export let x = 0;
    export let y = 0;
    export let content = '';
    export let visible = false;
</script>