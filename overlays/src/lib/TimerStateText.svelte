<svelte:options customElement="timer-state-text" />

<script lang="ts">
	import { MatchState } from './states';

	export let matchState: MatchState;
</script>

<div id="timer-state-text">
	<h4>
		{#if matchState === MatchState.SHOW_MATCH}
			Next
		{:else if [MatchState.AUTO, MatchState.AUTO_END].includes(matchState)}
			Auto
		{:else if matchState === MatchState.TRANSITION}
			Wait
		{:else if [MatchState.TELEOP, MatchState.ENDGAME].includes(matchState)}
			Teleop
		{:else if matchState === MatchState.FINISHED}
			Review
		{/if}
	</h4>
</div>

<style>
	#timer-state-text {
		position: absolute;
		left: 1860px;
		top: 448px;
		width: 120px;
		height: 40px;
		display: flex;
		justify-content: center;
		align-items: center;

		h4 {
			font-size: 24px;
			font-weight: 600;
			text-align: center;
		}
	}
</style>
