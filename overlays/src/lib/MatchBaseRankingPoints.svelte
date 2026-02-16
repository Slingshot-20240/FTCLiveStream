<svelte:options customElement="match-base-ranking-points" />

<script lang="ts">
	import { icons } from '$lib/assets';
	import type { Scores } from './types';

	export let scores: Scores | null;

	const rp = icons.rankingPoints;
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<div id="match-base-ranking-points-element">
	<img src={scores?.blue.movementRP ? rp.blueMovement : rp.blueMovementShaded} />
	<img src={scores?.blue.goalRP ? rp.blueGoal : rp.blueGoalShaded} />
	<img src={scores?.blue.patternRP ? rp.bluePattern : rp.bluePatternShaded} />

	<img src={scores?.red.patternRP ? rp.redPattern : rp.redPatternShaded} />
	<img src={scores?.red.goalRP ? rp.redGoal : rp.redGoalShaded} />
	<img src={scores?.red.movementRP ? rp.redMovement : rp.redMovementShaded} />
</div>

<style>
	#match-base-ranking-points-element {
		width: 656px;
		height: 96px;
		display: flex;
		gap: 16px;
	}
</style>
