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

    let svgTilt = $state(0);
    let isDraggingSvg = $state(false);
    let draggingSide = $state<'left' | 'right' | null>(null);
    let dragStartY = $state(0);
    let lastYaw = 0;
    let lastPitch = 0;

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

        lastYaw = yaw;
        lastPitch = pitch;

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'camTranslate',
                yaw: yaw,
                pitch: pitch,
                roll: svgTilt
            }));
        }
    }

    function handleSvgMouseDown(e: MouseEvent, side: 'left' | 'right') {
        isDraggingSvg = true;
        draggingSide = side;
        dragStartY = e.clientY;

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'camState',
                state: 'active'
            }));
        }
    }

    function handleGlobalMouseMove(e: MouseEvent) {
        if (!isDraggingSvg) return;
        let deltaY = e.clientY - dragStartY;
        
        let tilt = deltaY / 10;
        tilt = Math.max(-5, Math.min(5, tilt));
        
        if (draggingSide === 'left') {
            svgTilt = -tilt;
        } else {
            svgTilt = tilt;
        }

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'camTranslate',
                yaw: lastYaw,
                pitch: lastPitch,
                roll: svgTilt
            }));
        }
    }

    function handleGlobalMouseUp() {
        if (isDraggingSvg) {
            isDraggingSvg = false;
            draggingSide = null;
            svgTilt = 0;

            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'camTranslate',
                    yaw: lastYaw,
                    pitch: lastPitch,
                    roll: 0
                }));
                ws.send(JSON.stringify({
                    type: 'camState',
                    state: 'inactive'
                }));
            }
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
        width: 85vw;
        height: 80vh;
        box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
        border-radius: 8px;
        background: #111;
        border: #444 solid 3px;
        aspect-ratio: 16 / 9;
        margin-left:0px;
        margin-right:0px;
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

<svelte:window onmousemove={handleGlobalMouseMove} onmouseup={handleGlobalMouseUp} />

<main>
    <div id="sphere1" class="sphere"></div>
    <div id="sphere2" class="sphere"></div>
    <video hidden id="steamer" bind:this={videoRef}></video>
    <div>
        <nav class="group p-3 border-3 border-solid border-white w-[20vw] rounded-full m-3 text-center text-white flex gap-3 items-center justify-center mx-auto transition-all relative overflow-hidden">
            <div class="flex items-center gap-3 transition-opacity duration-300 group-hover:opacity-0">
                <Camera color="white" />
                <p>Current Cam: {currentCam}</p>
            </div>
            <div class="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button class="bg-white text-black px-4 py-1 rounded-full font-bold hover:bg-gray-200 cursor-pointer" onclick={() => currentCam = 1}>1</button>
                <button class="bg-white text-black px-4 py-1 rounded-full font-bold hover:bg-gray-200 cursor-pointer" onclick={() => currentCam = 2}>2</button>
            </div>
        </nav>
        <div class="flex flex-row items-center justify-around" style="transform: rotate({svgTilt}deg); transition: transform 0.15s ease-out; transform-origin: center;">
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] transition-all hover:text-white/90 cursor-grab active:cursor-grabbing"
                 onmousedown={(e) => handleSvgMouseDown(e, 'left')}>
                <svg class="-rotate-90" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <g transform="rotate(-35 3 13)">
                        <path d="m7 9-4 4 4 4" />
                    </g>
                    <path d="M3 13c3.6-4.8 14.4-4.8 18 0" />
                    <g transform="rotate(35 21 13)">
                        <path d="m17 9 4 4-4 4" />
                    </g>
                </svg>
            </div>
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
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] transition-all hover:text-white/90 cursor-grab active:cursor-grabbing"
                 onmousedown={(e) => handleSvgMouseDown(e, 'right')}>
                <svg class="rotate-90" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <g transform="rotate(-35 3 13)">
                        <path d="m7 9-4 4 4 4" />
                    </g>
                    <path d="M3 13c3.6-4.8 14.4-4.8 18 0" />
                    <g transform="rotate(35 21 13)">
                        <path d="m17 9 4 4-4 4" />
                    </g>
                </svg>
            </div>
        </div>
    </div>
</main>
