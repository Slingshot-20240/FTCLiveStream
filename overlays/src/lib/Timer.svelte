<svelte:options customElement="timer-element" />

<script lang="ts">
	import { MatchState } from './states';

	export let timer: number;
	export let matchState: MatchState;

	let displayTimer: string;

	$: {
		let segmentTimer: number;

		switch (matchState) {
			case MatchState.PREVIEW:
			case MatchState.AUTO:
			case MatchState.AUTO_END:
				segmentTimer = timer - 128;
				break;
			case MatchState.TRANSITION:
				segmentTimer = timer - 120;
				break;
			default:
				segmentTimer = timer;
				break;
		}

		const minutes = Math.floor(segmentTimer / 60);
		const seconds = segmentTimer % 60;
		displayTimer = `${minutes}:${seconds.toString().padStart(2, '0')}`;
	}
</script>

<div id="text-element"><h1 id="timer">{displayTimer}</h1></div>

<style>
	#text-element {
		position: absolute;
		left: 1816px;
		top: 304px;
		width: 208px;
		height: 112px;
		display: flex;
		justify-content: center;
		align-items: center;

		h1 {
			font-size: 64px;
			font-weight: 600;
			text-align: center;
			font-feature-settings: 'tnum';
		}
	}
</style>
