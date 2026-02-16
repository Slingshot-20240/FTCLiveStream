<svelte:options customElement="match-base-auto-leave" />

<script lang="ts">
	import { icons } from '$lib/assets';
	import type { Scores } from './types';

	export let scores: Scores | null;

	const loc = icons.locations;
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<div id="match-base-auto-leave-element">
	<div class="leave-group">
		<img src={scores?.blue.auto.robot1Leave ? loc.checkmark : loc.xmarkShaded} />
		<img src={scores?.blue.auto.robot2Leave ? loc.checkmark : loc.xmarkShaded} />
	</div>

	<div class="leave-group">
		<img src={scores?.red.auto.robot1Leave ? loc.checkmark : loc.xmarkShaded} />
		<img src={scores?.red.auto.robot2Leave ? loc.checkmark : loc.xmarkShaded} />
	</div>
</div>

<style>
	#match-base-auto-leave-element {
		width: 656px;
		height: 96px;
		display: flex;
		justify-content: space-between;

		.leave-group {
			display: flex;
			gap: 16px;
		}
	}
</style>
