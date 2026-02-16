<svelte:options customElement="pos-block" />

<script lang="ts">
	export let top: number | undefined;
	export let right: number | undefined;
	export let bottom: number | undefined;
	export let left: number | undefined;
</script>

<div
	class="pos-block"
	style={`
		position: absolute;
		${top !== undefined ? `top: ${top}px;` : ''}
		${right !== undefined ? `right: ${right}px;` : ''}
		${bottom !== undefined ? `bottom: ${bottom}px;` : ''}
		${left !== undefined ? `left: ${left}px;` : ''}
	`}
>
	<slot />
</div>