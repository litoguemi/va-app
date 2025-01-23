<script>
    import { onMount } from 'svelte';
    import { base } from '$app/paths';

    export let message = 'Click here';
    let showIndicator = true;

    onMount(() => {
        setTimeout(() => {
            showIndicator = false;
        }, 7000); // Hide the indicator after 2 seconds        
    });
</script>

<style>
    .indicator {
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 0.5rem;
        color: #3E89E3; /* You can change the color as needed */
        font-size: 20px;
        animation: blink 1s infinite;
        position: relative;
        width: 250px;
    }

    .indicator img {
        margin-right: 8px; /* Adjust spacing as needed */
        width: 30px; /* Adjust size as needed */
        height: 30px; /* Adjust size as needed */
        filter: invert(44%) sepia(68%) saturate(1569%) hue-rotate(194deg) brightness(95%) contrast(86%);
    }

    @keyframes blink {
        50% {
            opacity: 0.5;
        }
    }

    .hidden {
        display: none;
    }
</style>

<div class="{showIndicator ? 'indicator' : 'hidden'}">
    <span>{message}</span>
    <img src="/data/icons/hand-point-down-regular.svg" alt="Hand Pointing Icon">
        
</div>
