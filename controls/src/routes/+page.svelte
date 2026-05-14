<script lang="ts">
    import VanillaTilt from 'vanilla-tilt';
    import { Camera } from 'lucide-svelte';
    function tilt(node: HTMLElement, options: any) {
        VanillaTilt.init(node, options);
        return {
            destroy() {
                // @ts-ignore
                node.vanillaTilt?.destroy();
            }
        };
    }

    function handleMouseDown(e: MouseEvent) {
        // @ts-ignore
        const tiltInstance = e.currentTarget.vanillaTilt;
        if (tiltInstance) {
            tiltInstance.settings.max = 8;
            tiltInstance.settings.scale = 1.01;
            tiltInstance.settings.speed = 1000;
            tiltInstance.setTransition();
            tiltInstance.onMouseEnter();
            tiltInstance.onMouseMove(e);
        }
    }

    function handleMouseUp(e: MouseEvent) {
        // @ts-ignore
        const tiltInstance = e.currentTarget.vanillaTilt;
        if (tiltInstance) {
            // Use 0.001 instead of 0 to avoid division by zero in vanilla-tilt's reset math
            tiltInstance.settings.max = 0.001;
            tiltInstance.settings.scale = 1;
            tiltInstance.settings.speed = 1000;
            tiltInstance.setTransition();
            tiltInstance.reset();
        }
    }
    let currentCam = 1;
</script>

<style>
    main {
        background: #050505;
        margin: 0;
        padding: 0;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #feedDisplay {
        position: relative;
        z-index: 10;
        width: 90vw;
        height: 80vh;
        box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
        border-radius: 8px;
        background: #111;
        border: #444 solid 3px;
        aspect-ratio: 16 / 9;
    }

    .sphere {
        width: 60rem;
        height: 60rem;
        border-radius: 50%;
        position: absolute;
        pointer-events: none;
        filter: blur(80px);
        opacity: 0.6;
    }

    #sphere1 {
        background: radial-gradient(circle at center, hsla(0, 100%, 50%, 0.3), transparent 70%);
        bottom: -20rem;
        right: -10rem;
        z-index: 1;
    }

    #sphere2 {
        background: radial-gradient(circle at center, hsla(220, 100%, 50%, 0.3), transparent 70%);
        top: -20rem;
        left: -10rem;
        z-index: 1;
    }
    
</style>

<main>
    <div id="sphere1" class="sphere"></div>
    <div id="sphere2" class="sphere"></div>
    <div>
        <nav class="p-3 border-3 border-solid border-white w-[20vw] rounded-full m-3 text-center text-white flex gap-3 items-center justify-center mx-auto">
            <Camera color="white" />
            <p>Current Cam: {currentCam}</p>
        </nav>
        <canvas 
            id="feedDisplay" 
            onmousedown={handleMouseDown}
            onmouseup={handleMouseUp}
            onmouseleave={handleMouseUp}
            use:tilt={{ 
                max: 0, 
                speed: 1000, 
                glare: true, 
                "max-glare": 0.2,
                scale: 1,
                reverse: true,
                transition: true,
                easing: "cubic-bezier(.03,.98,.52,.99)"
            }}
        ></canvas>
    </div>
</main>
