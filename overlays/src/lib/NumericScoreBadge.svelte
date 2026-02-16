<svelte:options customElement="numeric-score-badge-element" />

<script lang="ts">
	import { badges } from './assets';
	import { MatchState } from './states';
	import { Alliance, NumericScoreBadgeType, type Scores } from './types';

	export let alliance: Alliance;
	export let type: NumericScoreBadgeType;
	export let matchState: MatchState;
	export let scores: Scores | null;

	let score: number;

	$: {
		const isAutoNotTeleopNotConversePotentiallyInverse = matchState < MatchState.TELEOP;

		switch (type) {
			case NumericScoreBadgeType.CLASSIFIED:
				score = scores
					? alliance === Alliance.BLUE
						? isAutoNotTeleopNotConversePotentiallyInverse
							? scores.blue.auto.classified
							: scores.blue.teleop.classified
						: isAutoNotTeleopNotConversePotentiallyInverse
							? scores.red.auto.classified
							: scores.red.teleop.classified
					: 0;
				break;
			case NumericScoreBadgeType.OVERFLOW:
				score = scores
					? alliance === Alliance.BLUE
						? isAutoNotTeleopNotConversePotentiallyInverse
							? scores.blue.auto.overflow
							: scores.blue.teleop.overflow
						: isAutoNotTeleopNotConversePotentiallyInverse
							? scores.red.auto.overflow
							: scores.red.teleop.overflow
					: 0;
				break;
			case NumericScoreBadgeType.DEPOT:
				score = scores
					? alliance === Alliance.BLUE
						? scores.blue.teleop.depot
						: scores.red.teleop.depot
					: 0;
				break;
			case NumericScoreBadgeType.PATTERN:
				score = scores
					? alliance === Alliance.BLUE
						? isAutoNotTeleopNotConversePotentiallyInverse
							? scores.blue.auto.motifs
							: scores.blue.teleop.motifs
						: isAutoNotTeleopNotConversePotentiallyInverse
							? scores.red.auto.motifs
							: scores.red.teleop.motifs
					: 0;
				break;
		}
	}
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<div class="numeric-score-badge-element zstack">
	{#if alliance === Alliance.BLUE}
		{#if type === NumericScoreBadgeType.CLASSIFIED}
			<img src={badges.game.blueClassified} />
		{:else if type === NumericScoreBadgeType.OVERFLOW}
			<img src={badges.game.blueOverflown} />
		{:else if type === NumericScoreBadgeType.DEPOT}
			<img src={badges.game.blueDepot} />
		{:else if type === NumericScoreBadgeType.PATTERN}
			<img src={badges.game.blueMotifs} />
		{/if}
	{:else if type === NumericScoreBadgeType.CLASSIFIED}
		<img src={badges.game.redClassified} />
	{:else if type === NumericScoreBadgeType.OVERFLOW}
		<img src={badges.game.redOverflown} />
	{:else if type === NumericScoreBadgeType.DEPOT}
		<img src={badges.game.redDepot} />
	{:else if type === NumericScoreBadgeType.PATTERN}
		<img src={badges.game.redMotifs} />
	{/if}

	<div class="score" class:blue={alliance === Alliance.BLUE} class:red={alliance === Alliance.RED}>
		<h2>{score}</h2>
	</div>
</div>

<style>
	.numeric-score-badge-element {
		width: 192px;
		height: 96px;

		.score {
			width: 96px;
			height: 96px;
			display: flex;
			align-items: center;
			justify-content: center;

			&.blue {
				margin-left: 96px;
			}

			&.red {
				margin-right: 96px;
			}

			h2 {
				color: #fff;
				font-size: 52px;
				font-weight: 600;
			}
		}
	}
</style>
