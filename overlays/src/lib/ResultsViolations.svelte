<svelte:options customElement="results-violations" />

<script lang="ts">
	import { badges, banners } from './assets';
	import type { Scores } from './types';

	export let results: Scores | null;

	const cards = badges.foulCards;
	const violations = banners.violations;

	function cardProvisioning(): string {
		return cards.yellow;
	}

	function violationProvisioning(): string {
		return violations.blueG206;
	}
</script>

<div id="results-violations"></div>

<style>
	#results-violations {
		position: absolute;
		top: 256px;
		left: 274px;
		width: 3292px;
		height: 176px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 16px;
	}
</style>
