<script lang="ts">
	import { onMount } from 'svelte';

	let latency: number;
	let init = false;
	let on = false;
	let tick = 0;

	onMount(() => {
		const params = new URLSearchParams(location.search);
		latency = +(params.get('latency') || prompt('Enter desired latency in seconds:', '2') || 2);

		init = true;

		accurateInterval(
			() => {
				on = !on;
				if (on) {
					tick++;
				}
			},
			(latency * 1000) / 2
		);
	});

	function accurateInterval(fn: () => void, intervalMs: number) {
		const veryStart = performance.now();
		let start = veryStart;

		function loop() {
			setTimeout(
				() => {
					console.log(performance.now() - veryStart);
					fn();
					start += intervalMs;
					loop();
				},
				start - performance.now() + intervalMs
			);
		}

		loop();
	}

	$: if (init) {
		document.body.style.backgroundColor = on ? '#0f0f' : '#0000';
	}
</script>

{#if on}
	<div>
		<h1>{tick}</h1>
		<p>{latency}</p>
	</div>
{/if}

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		font-family: monospace;
	}

	:global(body) {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100vw;
		height: 100vh;
	}

	div {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: -102vw;

		h1 {
			font-size: 50vw;

			@media (min-aspect-ratio: 1) {
				font-size: 50vh;
			}
		}

		p {
			font-size: 10vw;

			@media (min-aspect-ratio: 1) {
				font-size: 10vh;
			}
		}
	}
</style>
