<svelte:options customElement="timer-element" />

<script lang="ts">
	export let timer: number;
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<div id="text-element"><h1 id="timer">{timer}</h1></div>

<style>
	#text-element {
		position: absolute;
		left: 1816px;
		top: 304px;
		width: 208px;
		height: 112px;
		display: flex;
		justify-content: center;
		align-items: center;

		h1 {
			text-align: center;

			font-size: 64px;
			font-weight: 600;
		}
	}
</style>
