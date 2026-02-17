<svelte:options customElement="cards-element" />

<script lang="ts">
	import { badges } from './assets';
	import { State } from './states';
	import { Card, type Info, type Scores, type Team } from './types';

	export let state: State;
	export let info: Info | null;
	export let results: Scores | null;

	let blueTeams: Team[] | undefined;
	let redTeams: Team[] | undefined;

	$: blueTeams = (state == State.MATCH ? info : results)?.blueTeams;
	$: redTeams = (state == State.MATCH ? info : results)?.redTeams;

	const cards = badges.foulCards;

	function cardProvisioning(team?: Team): string {
		switch (team?.card) {
			case Card.YELLOW:
				return cards.yellow;
			case Card.RED:
				return cards.red;
			default:
				return '';
		}
	}
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<div id="cards-element">
	<div class="cards-group">
		<img src={cardProvisioning(blueTeams?.[0])} />
		<img src={cardProvisioning(blueTeams?.[1])} />
	</div>

	<div class="cards-group">
		<img src={cardProvisioning(redTeams?.[0])} />
		<img src={cardProvisioning(redTeams?.[1])} />
	</div>
</div>

<style>
	#cards-element {
		position: absolute;
		top: 256px;
		left: 274px;
		width: 3292px;
		display: flex;
		justify-content: space-between;

		.cards-group {
			width: 1044px;
			display: flex;
			justify-content: space-between;
		}
	}
</style>
