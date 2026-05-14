<script lang="ts">
    import VanillaTilt from 'vanilla-tilt';
    import { Camera } from 'lucide-svelte';
    import { onMount } from 'svelte';
    
    function tilt(node: HTMLElement, options: any) {
        VanillaTilt.init(node, options);
        return {
            destroy() {
                // @ts-ignore
                node.vanillaTilt?.destroy();
            }
        };
    }

    let currentCam = $state(1);
    let field1Url = $state('');
    let field2Url = $state('');
    let isMouseDown = false;
    
    let videoRef: HTMLVideoElement;
    let canvasRef: HTMLCanvasElement;
    let ws: WebSocket;
    let mpegtsPlayer: any = null;

    onMount(async () => {
        try {
            // Load stream URLs from the switcher backend - Assumed 5173
            const res = await fetch('http://localhost:17113/get-field-url');
            const data = await res.json();
            field1Url = data.field1;
            field2Url = data.field2;
        } catch (e) {
            console.error("Failed to fetch stream URLs:", e);
        }

        ws = new WebSocket('ws://localhost:8080');

        let animationFrameId: number;
        function drawLoop() {
            if (videoRef && canvasRef && videoRef.readyState >= 2) {
                const ctx = canvasRef.getContext("2d");
                if (ctx) {
                    ctx.drawImage(videoRef, 0, 0, canvasRef.width, canvasRef.height);
                }
            }
            animationFrameId = requestAnimationFrame(drawLoop);
        }
        drawLoop();

        return () => {
            if (ws) ws.close();
            if (mpegtsPlayer) mpegtsPlayer.destroy();
            cancelAnimationFrame(animationFrameId);
        };
    });

    let currentCamUrl = $derived(currentCam === 1 ? field1Url : field2Url);

    $effect(() => {
        if (currentCamUrl && videoRef) {
            import('mpegts.js').then((m) => {
                const mpegts = m.default;
                if (mpegtsPlayer) {
                    mpegtsPlayer.destroy();
                    mpegtsPlayer = null;
                }
                if (mpegts.isSupported() && (currentCamUrl.startsWith('rtmp://') || currentCamUrl.startsWith('ws://'))) {
                    mpegtsPlayer = mpegts.createPlayer({
                        type: 'mpegts',
                        url: currentCamUrl,
                        isLive: true
                    });
                    mpegtsPlayer.attachMediaElement(videoRef);
                    mpegtsPlayer.load();
                    mpegtsPlayer.play();
                } else {
                    videoRef.src = currentCamUrl;
                    videoRef.play().catch(() => {});
                }
            });
        }
    });

    function broadcastTranslation(e: MouseEvent) {
        if (!canvasRef) return;
        const rect = canvasRef.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Map x from [0, width] to [-5, 5]
        const yaw = (x / rect.width) * 10 - 5;
        // Map y from [0, height] to [-5, 5]
        const pitch = (y / rect.height) * 10 - 5;

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'camTranslate',
                yaw: yaw,
                pitch: pitch,
                roll: 0
            }));
        }
    }

    function handleMouseDown(e: MouseEvent) {
        isMouseDown = true;
        
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'camState',
                state: 'active'
            }));
        }

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
        broadcastTranslation(e);
    }

    function handleMouseUp(e: MouseEvent) {
        isMouseDown = false;
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

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'camState',
                state: 'inactive'
            }));
        }
    }

    function handleMouseMove(e: MouseEvent) {
        if (!isMouseDown) return;
        broadcastTranslation(e);
    }
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
    <video hidden id="steamer" bind:this={videoRef}></video>
    <div>
        <nav class="p-3 border-3 border-solid border-white w-[20vw] rounded-full m-3 text-center text-white flex gap-3 items-center justify-center mx-auto">
            <Camera color="white" />
            <p>Current Cam: {currentCam}</p>
        </nav>
        <canvas 
            id="feedDisplay" 
            bind:this={canvasRef}
            onmousedown={handleMouseDown}
            onmouseup={handleMouseUp}
            onmouseleave={handleMouseUp}
            onmousemove={handleMouseMove}
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
