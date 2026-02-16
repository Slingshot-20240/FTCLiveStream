<svelte:options customElement="scoreboard-element" />

<script lang="ts">
	import type { Scores } from './types';

	export let scores: Scores | null;
</script>

<div id="scoreboard-element">
	<div class="alliance-group">
		<div class="fouls-group">
			<div class="foul">
				<h4>{scores?.blue.minorFouls}</h4>
			</div>
			<div class="foul">
				<h4>{scores?.blue.majorFouls}</h4>
			</div>
		</div>
		<div class="score">
			<h1>{(scores?.blue?.preFoulTotal || 0) + (scores?.red?.foulPointsCommitted || 0)}</h1>
		</div>
	</div>

	<div class="alliance-group">
		<div class="score">
			<h1>{(scores?.red?.preFoulTotal || 0) + (scores?.blue?.foulPointsCommitted || 0)}</h1>
		</div>
		<div class="fouls-group">
			<div class="foul">
				<h4>{scores?.red.minorFouls}</h4>
			</div>
			<div class="foul">
				<h4>{scores?.red.majorFouls}</h4>
			</div>
		</div>
	</div>
</div>

<style>
	#scoreboard-element {
		position: absolute;
		left: 1528px;
		top: 304px;
		width: 784px;
		height: 112px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #fff;

		.alliance-group {
			width: 272px;
			display: flex;
			gap: 20px;

			.fouls-group {
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				gap: 10px;

				.foul {
					width: 44px;
					height: 48px;
					display: flex;
					justify-content: center;
					align-items: center;

					h4 {
						font-size: 28px;
						font-weight: 600;
						text-align: center;
					}
				}
			}

			.score {
				width: 208px;
				height: 112px;
				display: flex;
				justify-content: center;
				align-items: center;

				h1 {
					font-size: 72px;
					font-weight: 600;
					text-align: center;
					letter-spacing: 2px;
				}
			}
		}
	}
</style>
