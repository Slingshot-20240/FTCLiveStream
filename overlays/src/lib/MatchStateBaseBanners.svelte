<svelte:options customElement="match-state-base-banners" />

<script lang="ts">
	import { fade } from 'svelte/transition';

	import { banners } from '$lib/assets';
	import { MatchState } from './states';

	export let matchState: MatchState;
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<div id="match-state-base-banners">
	{#if matchState === MatchState.PREVIEW}
		<img
			id="preview-banner"
			src={banners.upNext}
			in:fade={{ duration: 500 }}
			out:fade={{ duration: 500 }}
		/>
	{:else if [MatchState.AUTO, MatchState.AUTO_END, MatchState.TRANSITION].includes(matchState)}
		<img
			id="leave-banner"
			src={banners.game.leave}
			in:fade={{ duration: 500 }}
			out:fade={{ duration: 500 }}
		/>
	{:else if [MatchState.TELEOP, MatchState.ENDGAME, MatchState.FINISHED].includes(matchState)}
		<img
			id="rp-banner"
			src={banners.game.rankingPoints}
			in:fade={{ duration: 500 }}
			out:fade={{ duration: 500 }}
		/>
	{:else if matchState === MatchState.ABORTED}
		<img
			id="aborted-banner"
			src={banners.matchAborted}
			in:fade={{ duration: 500 }}
			out:fade={{ duration: 500 }}
		/>
	{/if}
</div>

<style>
	#match-state-base-banners {
		width: 3840px;
		height: 2160px;

		* {
			position: absolute;
			left: 1592px;
			top: 160px;
			filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.25));
		}
	}
</style>
