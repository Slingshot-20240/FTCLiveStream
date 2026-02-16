<svelte:options customElement="results-scoreboard" />

<script lang="ts">
	import { banners, icons } from './assets';
	import { type Scores, Base } from './types';

	export let results: Scores | null;

	const rp = icons.rankingPoints;
	const loc = icons.locations;

	let blueTotal: number;
	let redTotal: number;

	$: blueTotal = (results?.blue.preFoulTotal || 0) + (results?.red.foulPointsCommitted || 0);
	$: redTotal = (results?.red.preFoulTotal || 0) + (results?.blue.foulPointsCommitted || 0);
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<div id="results-scoreboard">
	{#if results?.eventHighScore}
		<img id="high-score-banner" src={banners.results.eventHighScore} />
	{/if}

	<div class="summary">
		<div class="rp-group">
			<img src={blueTotal >= redTotal ? rp.win : rp.winShaded} />
			<img src={blueTotal > redTotal ? rp.win : rp.winShaded} />
			<img src={blueTotal > redTotal ? rp.win : rp.winShaded} />
			<img src={results?.blue.movementRP ? rp.blueMovement : rp.blueMovementShaded} />
			<img src={results?.blue.goalRP ? rp.blueGoal : rp.blueGoalShaded} />
			<img src={results?.blue.patternRP ? rp.bluePattern : rp.bluePatternShaded} />
		</div>

		<div class="center-group">
			<div class="final-scores">
				<h1>{blueTotal}</h1>
				<h1>{redTotal}</h1>
			</div>

			<div class="fouls-group">
				<div class="blue alliance-fouls-details">
					<h4>{results?.blue.minorFouls}</h4>
					<h4>{results?.blue.majorFouls}</h4>
				</div>

				<div class="foul-points">
					<h4>{results?.red.foulPointsCommitted}</h4>
					<h4>{results?.blue.foulPointsCommitted}</h4>
				</div>

				<div class="red alliance-fouls-details">
					<h4>{results?.red.minorFouls}</h4>
					<h4>{results?.red.majorFouls}</h4>
				</div>
			</div>
		</div>

		<div class="rp-group">
			<img src={redTotal > blueTotal ? rp.win : rp.winShaded} />
			<img src={redTotal > blueTotal ? rp.win : rp.winShaded} />
			<img src={redTotal >= blueTotal ? rp.win : rp.winShaded} />
			<img src={results?.red.patternRP ? rp.redPattern : rp.redPatternShaded} />
			<img src={results?.red.goalRP ? rp.redGoal : rp.redGoalShaded} />
			<img src={results?.red.movementRP ? rp.redMovement : rp.redMovementShaded} />
		</div>
	</div>

	<div class="details">
		<div class="stage-group">
			<div class="element-group">
				<h2>{results?.blue.auto.classified}</h2>
				<h2>{results?.red.auto.classified}</h2>
			</div>

			<div class="element-group">
				<h2>{results?.blue.auto.motifs}</h2>
				<h2>{results?.red.auto.motifs}</h2>
			</div>

			<div class="element-group">
				<h2>{results?.blue.auto.overflow}</h2>
				<h2>{results?.red.auto.overflow}</h2>
			</div>

			<div class="element-group">
				<div class="alliance-group">
					<img src={results?.blue.auto.robot1Leave ? loc.checkmark : loc.xmark} />
					<img src={results?.blue.auto.robot2Leave ? loc.checkmark : loc.xmark} />
				</div>

				<div class="alliance-group">
					<img src={results?.red.auto.robot1Leave ? loc.checkmark : loc.xmark} />
					<img src={results?.red.auto.robot2Leave ? loc.checkmark : loc.xmark} />
				</div>
			</div>
		</div>

		<div class="stage-group">
			<div class="element-group">
				<h2>{results?.blue.teleop.classified}</h2>
				<h2>{results?.red.teleop.classified}</h2>
			</div>

			<div class="element-group">
				<h2>{results?.blue.teleop.motifs}</h2>
				<h2>{results?.red.teleop.motifs}</h2>
			</div>

			<div class="element-group">
				<h2>{results?.blue.teleop.overflow}</h2>
				<h2>{results?.red.teleop.overflow}</h2>
			</div>

			<div class="element-group">
				<h2>{results?.blue.teleop.depot}</h2>
				<h2>{results?.red.teleop.depot}</h2>
			</div>

			<div class="element-group">
				<div class="alliance-group">
					{#if results?.blue?.teleop?.robot1Base === Base.PARTIAL}
						<img src={loc.partialPark} />
					{:else if results?.blue?.teleop?.robot1Base === Base.FULL}
						<img src={loc.fullPark} />
					{:else}
						<img src={loc.noPark} />
					{/if}

					{#if results?.blue?.teleop?.robot2Base === Base.PARTIAL}
						<img src={loc.partialPark} />
					{:else if results?.blue?.teleop?.robot2Base === Base.FULL}
						<img src={loc.fullPark} />
					{:else}
						<img src={loc.noPark} />
					{/if}
				</div>

				<div class="alliance-group">
					{#if results?.red?.teleop?.robot1Base === Base.PARTIAL}
						<img src={loc.partialPark} />
					{:else if results?.red?.teleop?.robot1Base === Base.FULL}
						<img src={loc.fullPark} />
					{:else}
						<img src={loc.noPark} />
					{/if}

					{#if results?.red?.teleop?.robot2Base === Base.PARTIAL}
						<img src={loc.partialPark} />
					{:else if results?.red?.teleop?.robot2Base === Base.FULL}
						<img src={loc.fullPark} />
					{:else}
						<img src={loc.noPark} />
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	#results-scoreboard {
		position: absolute;
		left: 1224px;
		top: 720px;
		width: 1392px;
		height: 880px;
		display: flex;
		align-items: center;
		color: #fff;

		#high-score-banner {
			position: absolute;
			top: -128px;
			left: 50%;
			transform: translateX(-50%);
			width: 656px;
			height: 96px;
		}

		.summary {
			width: 1392px;
			height: 208px;
			position: absolute;
			top: 0px;
			left: 32px;
			display: flex;
			gap: 16px;

			.rp-group {
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				grid-template-rows: repeat(2, 1fr);
				gap: 16px;
			}

			.center-group {
				width: 656px;
				height: 208px;
				display: flex;
				flex-direction: column;
				gap: 16px;

				.final-scores {
					width: 656px;
					height: 144px;
					display: flex;
					justify-content: space-between;
					align-items: center;

					h1 {
						width: 320px;
						font-size: 96px;
						font-weight: 600;
						text-align: center;
						letter-spacing: 4px;
					}
				}

				.fouls-group {
					width: 656px;
					height: 48px;
					display: flex;
					gap: 16px;

					.alliance-fouls-details,
					.foul-points {
						width: 208px;
						height: 48px;
						display: flex;
						align-items: center;

						h4 {
							font-size: 28px;
							font-weight: 600;
							text-align: center;
						}
					}

					.alliance-fouls-details {
						gap: 16px;

						&.blue h4 {
							margin-left: 48px;
						}

						&.red h4 {
							margin-right: 48px;
						}

						h4 {
							width: 48px;
						}
					}

					.foul-points {
						justify-content: space-between;

						h4 {
							width: 80px;
						}
					}
				}
			}
		}

		.details {
			width: 1392px;
			height: 544px;
			position: absolute;
			top: 336px;
			display: flex;
			gap: 48px;

			.stage-group {
				width: 672px;
				display: flex;
				flex-direction: column;
				gap: 16px;

				.element-group {
					width: 672px;
					height: 96px;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.alliance-group {
						display: flex;
					}

					h2 {
						width: 96px;
						font-size: 52px;
						font-weight: 600;
						text-align: center;
					}
				}
			}
		}
	}
</style>
