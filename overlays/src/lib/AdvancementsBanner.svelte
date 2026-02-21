<svelte:options customElement="advancements-banner" />

<script lang="ts">
	import { Marquee } from '@selemondev/svelte-marquee';
	import '@selemondev/svelte-marquee/dist/style.css';

	import type { Advancements, Award } from './types';
	import '$lib/avatars.css';
	import { icons } from './assets';
	import { decodeHtml } from './functions';

	export let advancements: Advancements | null;
	export let eventName: string;

	$: {
		console.log(advancements?.presenting);
	}

	$: currentTeam = advancements?.teams[advancements?.presenting];
	$: advancesTo = decodeHtml(advancements?.advancingTo || '???');

	$: marquee = (currentTeam?.name.length || 0) + (currentTeam?.location.length || 0) / 2.5 > 25;
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<div id="advancements-banner">
	<div class="team">
		{#if currentTeam}
			<span class="team-avatar team-{currentTeam.number}"></span>

			<div class="text">
				<h1>{currentTeam.number}</h1>

				<div class="name-container">
					{#if marquee}
						<Marquee fade={true}>
							<h1 class="name marquee">{currentTeam.name}</h1>
						</Marquee>
					{:else}
						<h1 class="name">{currentTeam.name}</h1>
					{/if}
				</div>

				<h3 class="location">{currentTeam.location}</h3>
			</div>
		{:else if advancesTo.length > 23}
			<div class="name-container">
				<Marquee fade={true}>
					<h1 class="text-only marquee">Advancing to {advancesTo}</h1>
				</Marquee>
			</div>
		{:else}
			<h1 class="text-only">Advancing to {advancesTo}</h1>
		{/if}
	</div>

	<div class="info">
		<div class="title">
			<img src={icons.advancement} />
			{#if advancements?.presenting === -1}
				<h3><b>Advancements</b> ({advancements?.count} Teams)</h3>
			{:else}
				<h3>
					Team {(advancements?.presenting || 0) + 1}/{advancements?.count} - <b>Advancements</b>
				</h3>
			{/if}
		</div>
		<h3>{eventName}</h3>
	</div>
</div>

<style>
	#advancements-banner {
		position: absolute;
		top: 1744px;
		left: 1128px;
		width: 2072px;
		height: 272px;
		display: flex;
		flex-direction: column;

		.team {
			position: absolute;
			left: 48px;
			width: 1696px;
			height: 192px;
			display: flex;
			align-items: center;
			gap: 24px;
			color: #fff;

			h1 {
				font-size: 72px;
				font-weight: 500;

				&.text-only {
					margin-left: 4px;
				}
			}

			--animate-marquee-left: marquee-left 24s linear infinite;

			.team-avatar {
				width: 64px;
				height: 64px;
				border-radius: 16px;
			}

			.text {
				display: flex;
				align-items: baseline;
				gap: 24px;

				.name-container {
					max-width: 1088px;
				}

				.name {
					font-weight: 400;
				}

				h3 {
					margin-left: 12px;
					font-size: 36px;
					font-weight: 400;
				}
			}

			.marquee {
				margin-left: 128px !important;
			}
		}

		.info {
			position: absolute;
			top: 192px;
			left: 48px;
			width: 1976px;
			height: 80px;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.title {
				display: flex;
				gap: 24px;

				img {
					width: 48px;
					height: 48px;
				}
			}

			h3 {
				font-size: 36px;
				font-weight: 400;

				b {
					font-weight: 500;
				}
			}
		}
	}
</style>
