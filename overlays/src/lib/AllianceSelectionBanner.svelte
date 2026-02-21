<svelte:options customElement="alliance-selection-banner" />

<script lang="ts">
	import { Marquee } from '@selemondev/svelte-marquee';
	import '@selemondev/svelte-marquee/dist/style.css';

	import type { AllianceSelection } from './types';
	import '$lib/avatars.css';
	import { icons } from './assets';

	export let as: AllianceSelection | null;
	export let lastAs = as;
	export let eventName: string;

	$: showing = Math.max((as?.picking || 0) - 1, 0);
	$: teams = as?.alliances[showing];

	$: {
		if ((as?.picking || 0) < (lastAs?.picking || 0)) {
			showing = as?.picking || 0;
		}
		lastAs = as;
	}
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<div id="alliance-selection-banner">
	<div class="alliance">
		<div class="team">
			<span class="team-avatar team-{teams?.[0].number}"></span>

			<div class="text">
				<h1>{teams?.[0].number}</h1>
				<div class="details">
					<h4>Captain</h4>

					{#if (teams?.[0].name.length || 0) > 13}
						<Marquee fade={true}>
							<h2 class="marquee">{teams?.[0].name}</h2>
						</Marquee>
					{:else}
						<h2>{teams?.[0].name}</h2>
					{/if}
				</div>
			</div>
		</div>

		<span class="divider"></span>

		<div class="team">
			<span class="team-avatar team-{teams?.[1].number}"></span>

			<div class="text">
				<h1>{teams?.[1].number}</h1>
				<div class="details">
					<h4>Partner</h4>

					{#if (teams?.[1].name.length || 0) > 13}
						<Marquee fade={true}>
							<h2 class="marquee">{teams?.[1].name}</h2>
						</Marquee>
					{:else}
						<h2>{teams?.[1].name}</h2>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<div class="info">
		<div class="title">
			<img src={icons.allianceSelection} />
			<h3>
				Alliance {showing + 1} - <b>Alliance Selection</b>
			</h3>
		</div>
		<h3>{eventName}</h3>
	</div>
</div>

<style>
	#alliance-selection-banner {
		position: absolute;
		top: 1744px;
		left: 1128px;
		width: 2072px;
		height: 272px;
		display: flex;
		flex-direction: column;

		.alliance {
			position: absolute;
			left: 48px;
			width: 1712px;
			height: 192px;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.team {
				width: 820px;
				display: flex;
				align-items: center;
				gap: 24px;
				color: #fff;

				.team-avatar {
					width: 64px;
					height: 64px;
					border-radius: 16px;
				}

				.text {
					width: 732px;
					display: flex;
					align-items: center;
					gap: 24px;

					h1 {
						font-size: 72px;
						font-weight: 500;
					}

					.details {
						max-width: 532px;
						display: flex;
						flex-direction: column;
						gap: 8px;

						h4 {
							padding-left: 2px;
							font-size: 28px;
							font-weight: 400;
						}

						--animate-marquee-left: marquee-left 12s linear infinite;

						h2 {
							font-size: 48px;
							font-weight: 500;

							&.marquee {
								margin-left: 64px;
							}
						}
					}
				}
			}

			span.divider {
				width: 2px;
				height: 96px;
				background-color: #ffffffaa;
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
