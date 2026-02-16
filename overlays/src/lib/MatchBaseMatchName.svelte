<svelte:options customElement="match-base-match-name" />

<script lang="ts">
	import type { Info, Scores } from './types';

	export let info: Info | null;
	export let results: Scores | null;
</script>

<div id="match-base-match-name-element">
	<h2>{info?.matchName || results?.matchName || '???'}</h2>
</div>

<style>
	#match-base-match-name-element {
		width: 3840px;
		height: 160px;
		display: flex;
		justify-content: center;
		align-items: center;

		h2 {
			font-size: 48px;
			font-weight: 500;
			color: #fff;
		}
	}
</style>
