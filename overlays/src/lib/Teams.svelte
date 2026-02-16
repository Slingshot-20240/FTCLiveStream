<svelte:options customElement="teams-element" />

<script lang="ts">
	import { Marquee } from '@selemondev/svelte-marquee';
	import '@selemondev/svelte-marquee/dist/style.css';

	import type { Info, Scores } from './types';

	export let info: Info | null;
	export let results: Scores | null;
	export let position: 'top' | 'bottom';

	const numbers = {
		blue: [
			(info || results)?.blueTeams[0].number || '???',
			(info || results)?.blueTeams[1].number || '???'
		],
		red: [
			(info || results)?.redTeams[0].number || '???',
			(info || results)?.redTeams[1].number || '???'
		]
	};

	const names = {
		blue: [
			(info || results)?.blueTeams[0].name || '???',
			(info || results)?.blueTeams[1].name || '???'
		],
		red: [
			(info || results)?.redTeams[0].name || '???',
			(info || results)?.redTeams[1].name || '???'
		]
	};

	const ranks = {
		blue: [(info || results)?.blueTeams[0].rank, (info || results)?.blueTeams[1].rank],
		red: [(info || results)?.redTeams[0].rank, (info || results)?.redTeams[1].rank]
	};

	const marquee = {
		blue: [names.blue[0].length > 20, names.blue[1].length > 20],
		red: [names.red[0].length > 20, names.red[1].length > 20]
	};
</script>

<div id="teams-element" class={position}>
	<div class="alliance-group">
		<div class="team-group">
			<div class="team-number-and-name" class:marquee={marquee.blue[0]}>
				<h2 class="team-number">{numbers.blue[0]}</h2>

				{#if names.blue[0].length > 20}
					<Marquee fade={true}>
						<h2 class="team-name">{names.blue[0]}</h2>
					</Marquee>
				{:else}
					<h2 class="team-name">{names.blue[0]}</h2>
				{/if}
			</div>
			<h2 class="team-rank">{ranks.blue[0]}</h2>
		</div>

		<div class="team-group">
			<div class="team-number-and-name" class:marquee={marquee.blue[1]}>
				<h2 class="team-number">{numbers.blue[1]}</h2>

				{#if names.blue[1].length > 20}
					<Marquee fade={true}>
						<h2 class="team-name">{names.blue[1]}</h2>
					</Marquee>
				{:else}
					<h2 class="team-name">{names.blue[1]}</h2>
				{/if}
			</div>
			<h2 class="team-rank">{ranks.blue[1]}</h2>
		</div>
	</div>

	<div class="alliance-group">
		<div class="team-group">
			<h2 class="team-rank">{ranks.red[0]}</h2>
			<div class="team-number-and-name" class:marquee={marquee.red[0]}>
				{#if names.red[0].length > 20}
					<Marquee fade={true}>
						<h2 class="team-name">{names.red[0]}</h2>
					</Marquee>
				{:else}
					<h2 class="team-name">{names.red[0]}</h2>
				{/if}

				<h2 class="team-number">{numbers.red[0]}</h2>
			</div>
		</div>

		<div class="team-group">
			<h2 class="team-rank">{ranks.red[1]}</h2>
			<div class="team-number-and-name" class:marquee={marquee.red[1]}>
				{#if names.red[1].length > 20}
					<Marquee fade={true}>
						<h2 class="team-name">{names.red[1]}</h2>
					</Marquee>
				{:else}
					<h2 class="team-name">{names.red[1]}</h2>
				{/if}

				<h2 class="team-number">{numbers.red[1]}</h2>
			</div>
		</div>
	</div>
</div>

<style>
	#teams-element {
		position: absolute;
		left: 16px;
		width: 3808px;
		height: 96px;
		display: flex;
		justify-content: space-between;

		&.top {
			top: 160px;
		}

		&.bottom {
			bottom: 16px;
		}

		.alliance-group {
			display: flex;
			gap: 16px;

			.team-group {
				width: 772px;
				height: 96px;
				display: flex;
				align-items: center;
				font-size: 28px;
				color: #fff;

				.team-number-and-name {
					width: 676px;
					padding: 10px 24px;
					display: flex;
					justify-content: space-between;
					align-items: center;
					gap: 24px;

					&.marquee {
						--animate-marquee-left: marquee-left 20s linear infinite;

						.team-name {
							margin-left: 64px;
						}
					}
				}

				.team-number,
				.team-rank {
					font-weight: 600;
				}

				.team-name {
					font-weight: 400;
				}

				.team-rank {
					width: 96px;
					font-size: 52px;
					color: #000;
					text-align: center;
				}
			}
		}
	}
</style>
