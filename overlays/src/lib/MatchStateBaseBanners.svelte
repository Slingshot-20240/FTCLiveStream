<svelte:options customElement="match-state-base-banners" />

<script lang="ts">
	import { fade } from 'svelte/transition';

	import { banners } from '$lib/assets';
	import { MatchState } from './states';
	import type { Scores } from './types';
	import MatchBaseAutoLeave from './MatchBaseAutoLeave.svelte';
	import MatchBaseRankingPoints from './MatchBaseRankingPoints.svelte';

	export let matchState: MatchState;
	export let scores: Scores | null;
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<div id="match-state-base-banners" class="full-frame">
	{#if matchState < MatchState.SHOW_MATCH}
		<img
			id="preview-banner"
			src={banners.upNext}
			in:fade={{ duration: 500 }}
			out:fade={{ duration: 500 }}
		/>
	{:else if matchState >= MatchState.SHOW_MATCH && matchState < MatchState.TELEOP}
		<div class="zstack" in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
			<img id="leave-banner" src={banners.game.leave} />
			<MatchBaseAutoLeave bind:scores />
		</div>
	{:else if matchState >= MatchState.TELEOP && matchState !== MatchState.ABORTED}
		<div class="zstack" in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
			<img id="rp-banner" src={banners.game.rankingPoints} />
			<MatchBaseRankingPoints bind:scores />
		</div>
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
	#match-state-base-banners > * {
		position: absolute;
		left: 1592px;
		top: 160px;
		filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.25));
	}
</style>
