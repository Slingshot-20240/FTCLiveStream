<svelte:options customElement="results-banners" />

<script lang="ts">
	import { banners } from '$lib/assets';
	import type { Scores } from './types';

	export let results: Scores | null;

	let blueTotal: number;
	let redTotal: number;

	$: blueTotal = (results?.blue.preFoulTotal || 0) + (results?.red.foulPointsCommitted || 0);
	$: redTotal = (results?.red.preFoulTotal || 0) + (results?.blue.foulPointsCommitted || 0);
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<div id="results-banners" class="full-frame">
	{#if blueTotal > redTotal}
		<img id="blue-wins-banner" src={banners.results.blueWins} />
	{:else if redTotal > blueTotal}
		<img id="red-wins-banner" src={banners.results.redWins} />
	{:else}
		<img id="tie-banner" src={banners.results.tie} />
	{/if}
</div>

<style>
	#results-banners > * {
		position: absolute;
		left: 1592px;
		top: 160px;
		filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.25));
	}
</style>
