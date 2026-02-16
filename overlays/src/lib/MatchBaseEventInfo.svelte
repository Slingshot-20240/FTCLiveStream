<svelte:options customElement="match-base-event-info" />

<script lang="ts">
	export let region: string;
	export let level: string;
</script>

<div id="match-base-event-info-element">
	<h2>{region}</h2>
	<h2>{level}</h2>
</div>

<style>
	#match-base-event-info-element {
		position: absolute;
		left: 472px;
		width: 3052px;
		height: 160px;
		display: flex;
		justify-content: space-between;
		align-items: center;

		h2 {
			font-size: 48px;
			font-weight: 400;
			color: #fff;
		}
	}
</style>
