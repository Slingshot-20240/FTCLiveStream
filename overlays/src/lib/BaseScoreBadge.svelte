<svelte:options customElement="base-score-badge-element" />

<script lang="ts">
	import { badges, icons } from './assets';
	import { Alliance, type Scores, Base } from './types';

	export let alliance: Alliance;
	export let scores: Scores | null;

	const base = icons.locations;

	$: console.log(scores?.red?.teleop?.robot1Base === Base.FULL);
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<div class="base-score-badge-element zstack">
	<img src={alliance === Alliance.BLUE ? badges.game.blueParking : badges.game.redParking} />

	<div class="bases">
		{#if alliance === Alliance.BLUE}
			{#if scores?.blue?.teleop?.robot1Base === Base.PARTIAL}
				<img src={base.partialPark} />
			{:else if scores?.blue?.teleop?.robot1Base === Base.FULL}
				<img src={base.fullPark} />
			{:else}
				<img src={base.noPark} />
			{/if}

			{#if scores?.blue?.teleop?.robot2Base === Base.PARTIAL}
				<img src={base.partialPark} />
			{:else if scores?.blue?.teleop?.robot2Base === Base.FULL}
				<img src={base.fullPark} />
			{:else}
				<img src={base.noPark} />
			{/if}
		{:else}
			{#if scores?.red?.teleop?.robot1Base === Base.PARTIAL}
				<img src={base.partialPark} />
			{:else if scores?.red?.teleop?.robot1Base === Base.FULL}
				<img src={base.fullPark} />
			{:else}
				<img src={base.noPark} />
			{/if}

			{#if scores?.red?.teleop?.robot2Base === Base.PARTIAL}
				<img src={base.partialPark} />
			{:else if scores?.red?.teleop?.robot2Base === Base.FULL}
				<img src={base.fullPark} />
			{:else}
				<img src={base.noPark} />
			{/if}
		{/if}
	</div>
</div>

<style>
	.base-score-badge-element {
		width: 288px;
		height: 96px;

		.bases {
			width: 288px;
			height: 96px;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}
</style>
