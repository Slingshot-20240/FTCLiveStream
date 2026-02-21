<svelte:options customElement="awards-banner" />

<script lang="ts">
	import { Marquee } from '@selemondev/svelte-marquee';
	import '@selemondev/svelte-marquee/dist/style.css';

	import type { Award } from './types';
	import '$lib/avatars.css';
	import { icons } from './assets';
	import { decodeHtml } from './functions';

	export let award: Award | null;
	export let eventName: string;

	$: currentWinner = award?.winners[award?.presenting];
	$: currentPlace = currentWinner?.place;
	$: currentTeam = currentWinner?.team;
	$: currentIndividual = currentWinner?.individualName;

	$: teamMarquee = (currentTeam?.name.length || 0) + (currentTeam?.location.length || 0) / 2.5 > 25;
	$: individualMarquee = (currentIndividual?.length || 0) > 25;
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<div id="awards-banner">
	<div class="winner">
		{#if currentTeam}
			<span class="team-avatar team-{currentTeam.number}"></span>

			<div class="text">
				<h1>{currentTeam.number}</h1>

				<div class="name-container">
					{#if teamMarquee}
						<Marquee fade={true}>
							<h1 class="name marquee">{currentTeam.name}</h1>
						</Marquee>
					{:else}
						<h1 class="name">{currentTeam.name}</h1>
					{/if}
				</div>

				<h3 class="location">{currentTeam.location}</h3>
			</div>
		{:else if currentIndividual}
			<div class="name-container">
				{#if individualMarquee}
					<Marquee fade={true}>
						<h1 class="marquee">{currentIndividual}</h1>
					</Marquee>
				{:else}
					<h1 class="text-only">{currentIndividual}</h1>
				{/if}
			</div>
		{:else}
			<h1 class="text-only">{decodeHtml(award?.name || '???')}</h1>
		{/if}
	</div>

	<div class="info">
		<div class="title">
			{#if award?.presenting === -1}
				<div class="medals-stack">
					<img src={icons.medals.gold} />
					<img src={icons.medals.silver} />
					<img src={icons.medals.bronze} />
				</div>

				<h3><b>Awards Ceremony</b></h3>
			{:else}
				{#if currentPlace === 1}
					<img src={icons.medals.gold} />
				{:else if currentPlace === 2}
					<img src={icons.medals.silver} />
				{:else if currentPlace === 3}
					<img src={icons.medals.bronze} />
				{/if}

				<h3>
					{currentPlace}{currentPlace === 1
						? 'st'
						: currentPlace === 2
							? 'nd'
							: currentPlace === 3
								? 'rd'
								: 'th'} Place - <b>{decodeHtml(award?.name || '???')}</b>
				</h3>
			{/if}
		</div>
		<h3>{eventName}</h3>
	</div>
</div>

<style>
	#awards-banner {
		position: absolute;
		top: 1744px;
		left: 1128px;
		width: 2072px;
		height: 272px;
		display: flex;
		flex-direction: column;

		.winner {
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

				.medals-stack,
				& > img {
					filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.25));
				}

				.medals-stack {
					display: flex;
					margin-left: 20px;

					* {
						margin-left: -20px;

						&:nth-child(1) {
							z-index: 3;
						}

						&:nth-child(2) {
							z-index: 2;
						}

						&:nth-child(3) {
							z-index: 1;
						}
					}
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
