<svelte:options customElement="results-violations" />

<script lang="ts">
	import { banners } from './assets';
	import { Alliance, Card, Violation, type AllianceScores, type Scores, type Team } from './types';

	export let results: Scores | null;

	const violations = banners.violations;

	let noBlueCards: boolean;
	let noRedards: boolean;

	$: noBlueCards = !results || results.blueTeams.every((team) => team.card === Card.NONE);

	$: noRedCards = !results || results.redTeams.every((team) => team.card === Card.NONE);

	function violationProvisioning(alliance: Alliance, violation: Violation): string {
		switch (violation) {
			case Violation.G206:
				return alliance == Alliance.BLUE ? violations.blueG206 : violations.redG206;
			case Violation.G417A:
				return alliance == Alliance.BLUE ? violations.blueG417A : violations.redG417A;
			case Violation.G418A:
				return alliance == Alliance.BLUE ? violations.blueG418A : violations.redG418A;
			case Violation.G418B:
				return alliance == Alliance.BLUE ? violations.blueG418B : violations.redG418B;
			case Violation.G419B:
				return alliance == Alliance.BLUE ? violations.blueG419B : violations.redG419B;
			case Violation.G431C:
				return alliance == Alliance.BLUE ? violations.blueG431C : violations.redG431C;
		}
	}
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<div id="results-violations">
	<div class="violations-group" class:remove-top-margin={noBlueCards}>
		{#each results?.blue.violations as violation}
			<img src={violationProvisioning(Alliance.BLUE, violation)} />
		{/each}
	</div>

	<div class="violations-group" class:remove-top-margin={noRedCards}>
		{#each results?.red.violations as violation}
			<img src={violationProvisioning(Alliance.RED, violation)} />
		{/each}
	</div>
</div>

<style>
	#results-violations {
		position: absolute;
		top: 320px;
		left: 284px;
		width: 3272px;
		display: flex;
		justify-content: space-between;

		.violations-group {
			display: flex;
			flex-direction: column;
			gap: 16px;
		}
	}

	.remove-top-margin {
		margin-top: -32px;
	}
</style>
