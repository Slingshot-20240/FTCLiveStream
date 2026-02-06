<script lang="ts">
	import type Mpegts from 'mpegts.js';
	import { onMount } from 'svelte';

	let video: HTMLVideoElement;
	let player: Mpegts.Player;

	let interval: NodeJS.Timeout;
	let fps = 30;

	onMount(async () => {
		const params = new URLSearchParams(location.search);
		const url = params.get('url');
		fps = +(params.get('fps') || fps);

		if (!url) {
			alert(`Please enter a URL in the "url" query parameter, e.g. "?url=rtmp://localhost/live"`);
			window.close();
			return;
		}

		const mpegts = (await import('mpegts.js')).default;

		if (mpegts.isSupported()) {
			player = mpegts.createPlayer({
				type: 'mpegts',
				url: url
			});

			player.attachMediaElement(video);
			player.load();

			playPause();
		}
	});

	function playPause() {
		if (video.paused) {
			interval = setInterval(() => {
				player.play();
			}, 1);
		} else {
			clearInterval(interval);
			player.pause();
		}
	}

	function offset(frames: number) {
		video.requestVideoFrameCallback(() => {
			video.currentTime += (frames + 2) / fps;
		});
	}
</script>

<div id="frame">
	<div id="content">
		<video bind:this={video} playsinline></video>
		<button on:click={playPause}>Play / Pause</button>
		<div>
			<button on:click={() => offset(-fps / 6)}>← {fps / 6} F</button>
			<button on:click={() => offset(-1)}>← 1 F</button>
			<button on:click={() => offset(1)}>1 F →</button>
			<button on:click={() => offset(fps / 6)}>{fps / 6} F →</button>
		</div>
		<div>
			<button on:click={() => offset(-fps)}>← {fps} F</button>
			<button on:click={() => offset(-fps / 3)}>← {fps / 3} F</button>
			<button on:click={() => offset(fps / 3)}>{fps / 3} F →</button>
			<button on:click={() => offset(fps)}>{fps} F →</button>
		</div>
	</div>
</div>

<style>
	:global(:root, body, *) {
		margin: 0;
	}

	:global(:root, body) {
		background-color: #0000;
	}

	#frame {
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: left;
		align-items: top;

		#content {
			width: 100vw;
			display: flex;
			flex-direction: column;
			gap: 2vw;
			overflow: hidden;

			video {
				width: 100vw;
				height: calc(100vw / 16 * 9);
			}

			div {
				display: flex;
				gap: 2vw;
			}

			button {
				width: 100%;
				font-size: 2vw;
			}
		}
	}
</style>
