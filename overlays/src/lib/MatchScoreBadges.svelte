<svelte:options customElement="match-score-badges" />

<script lang="ts">
	import { fade } from 'svelte/transition';

	import { MatchState } from './states';
	import { Alliance, Base, NumericScoreBadgeType, type Scores } from './types';
	import NumericScoreBadge from './NumericScoreBadge.svelte';
	import BaseScoreBadge from './BaseScoreBadge.svelte';

	export let matchState: MatchState;
	export let scores: Scores | null;

	let positions = {
		classified: { x: 928, y: 532 },
		overflow: { x: 704, y: 996 },
		pattern: { x: 816, y: 764 },
		depot: { x: 704, y: 532 },
		base: { x: 2366, y: 1824 }
	};
</script>

<div
	id="match-score-badges"
	class="full-frame"
	in:fade={{ duration: 500 }}
	out:fade={{ duration: 500 }}
>
	{#if matchState >= MatchState.SHOW_MATCH}
		<pos-block
			top={positions.classified.y}
			left={positions.classified.x}
			in:fade={{ duration: 500 }}
			out:fade={{ duration: 500 }}
		>
			<NumericScoreBadge
				alliance={Alliance.BLUE}
				type={NumericScoreBadgeType.CLASSIFIED}
				bind:matchState
				bind:scores
			/>
		</pos-block>

		<pos-block
			top={positions.classified.y}
			right={positions.classified.x}
			in:fade={{ duration: 500 }}
			out:fade={{ duration: 500 }}
		>
			<NumericScoreBadge
				alliance={Alliance.RED}
				type={NumericScoreBadgeType.CLASSIFIED}
				bind:matchState
				bind:scores
			/>
		</pos-block>

		<pos-block
			top={positions.overflow.y}
			left={positions.overflow.x}
			in:fade={{ duration: 500 }}
			out:fade={{ duration: 500 }}
		>
			<NumericScoreBadge
				alliance={Alliance.BLUE}
				type={NumericScoreBadgeType.OVERFLOW}
				bind:matchState
				bind:scores
			/>
		</pos-block>

		<pos-block
			top={positions.overflow.y}
			right={positions.overflow.x}
			in:fade={{ duration: 500 }}
			out:fade={{ duration: 500 }}
		>
			<NumericScoreBadge
				alliance={Alliance.RED}
				type={NumericScoreBadgeType.OVERFLOW}
				bind:matchState
				bind:scores
			/>
		</pos-block>
	{/if}

	{#if [MatchState.AUTO_END, MatchState.TRANSITION, MatchState.ENDGAME, MatchState.FINISHED].includes(matchState)}
		<pos-block
			top={positions.pattern.y}
			left={positions.pattern.x}
			in:fade={{ duration: 500 }}
			out:fade={{ duration: 500 }}
		>
			<NumericScoreBadge
				alliance={Alliance.BLUE}
				type={NumericScoreBadgeType.PATTERN}
				bind:matchState
				bind:scores
			/>
		</pos-block>

		<pos-block
			top={positions.pattern.y}
			right={positions.pattern.x}
			in:fade={{ duration: 500 }}
			out:fade={{ duration: 500 }}
		>
			<NumericScoreBadge
				alliance={Alliance.RED}
				type={NumericScoreBadgeType.PATTERN}
				bind:matchState
				bind:scores
			/>
		</pos-block>
	{/if}

	{#if matchState >= MatchState.TELEOP}
		<pos-block
			top={positions.depot.y}
			left={positions.depot.x}
			in:fade={{ duration: 500 }}
			out:fade={{ duration: 500 }}
		>
			<NumericScoreBadge
				alliance={Alliance.BLUE}
				type={NumericScoreBadgeType.DEPOT}
				bind:matchState
				bind:scores
			/>
		</pos-block>

		<pos-block
			top={positions.depot.y}
			right={positions.depot.x}
			in:fade={{ duration: 500 }}
			out:fade={{ duration: 500 }}
		>
			<NumericScoreBadge
				alliance={Alliance.RED}
				type={NumericScoreBadgeType.DEPOT}
				bind:matchState
				bind:scores
			/>
		</pos-block>
	{/if}

	{#if matchState >= MatchState.ENDGAME}
		<pos-block
			top={positions.base.y}
			left={positions.base.x}
			in:fade={{ duration: 500 }}
			out:fade={{ duration: 500 }}
		>
			<BaseScoreBadge alliance={Alliance.BLUE} bind:scores />
		</pos-block>

		<pos-block
			top={positions.base.y}
			right={positions.base.x}
			in:fade={{ duration: 500 }}
			out:fade={{ duration: 500 }}
		>
			<BaseScoreBadge alliance={Alliance.RED} bind:scores />
		</pos-block>
	{/if}
</div>

<style>
	#match-score-badges {
		filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.25));
	}
</style>
