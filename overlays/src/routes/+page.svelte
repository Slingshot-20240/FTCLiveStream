<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { DisplayResultsVideo } from '$lib/types';
	import { layers, audios, videos } from '$lib/assets';

	let matchStartAudio: HTMLAudioElement;
	let autoEndAudio: HTMLAudioElement;
	let pickUpControllersAudio: HTMLAudioElement;
	let threeTwoOneAudio: HTMLAudioElement;
	let teleopStartAudio: HTMLAudioElement;
	let endgameAudio: HTMLAudioElement;
	let matchEndAudio: HTMLAudioElement;
	let resultsAudio: HTMLAudioElement;
	let abortAudio: HTMLAudioElement;

	let blueWinsVideo: HTMLVideoElement;
	let redWinsVideo: HTMLVideoElement;
	let tieVideo: HTMLVideoElement;
	let displayResultsVideo = DisplayResultsVideo.NONE as DisplayResultsVideo;

	onMount(() => {
		matchStartAudio = new Audio(audios.matchStart);
		autoEndAudio = new Audio(audios.autoEnd);
		pickUpControllersAudio = new Audio(audios.pickUpControllers);
		threeTwoOneAudio = new Audio(audios.threeTwoOne);
		teleopStartAudio = new Audio(audios.teleopStart);
		endgameAudio = new Audio(audios.endgame);
		matchEndAudio = new Audio(audios.matchEnd);
		resultsAudio = new Audio(audios.results);
		abortAudio = new Audio(audios.abort);

		matchStartAudio.load();
		autoEndAudio.load();
		pickUpControllersAudio.load();
		threeTwoOneAudio.load();
		teleopStartAudio.load();
		endgameAudio.load();
		matchEndAudio.load();
		resultsAudio.load();
		abortAudio.load();

		blueWinsVideo = document.getElementById('blue-wins-video') as HTMLVideoElement;
		redWinsVideo = document.getElementById('red-wins-video') as HTMLVideoElement;
		tieVideo = document.getElementById('tie-video') as HTMLVideoElement;

		blueWinsVideo.load();
		redWinsVideo.load();
		tieVideo.load();
	});
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<!-- svelte-ignore a11y_media_has_caption -->
<div id="frame">
	<div id="content" class="zstack">
		<div id="backgrounds" class="zstack">
			<img
				id="logo"
				src={layers.backgrounds.logo}
				in:fade={{ duration: 500 }}
				out:fade={{ duration: 500 }}
			/>

			<img
				id="match-base-darkening"
				src={layers.backgrounds.matchBaseDarkening}
				in:fade={{ duration: 500 }}
				out:fade={{ duration: 500 }}
			/>

			<img
				id="results-darkening"
				src={layers.backgrounds.resultsDarkening}
				in:fade={{ duration: 500 }}
				out:fade={{ duration: 500 }}
			/>

			<img
				id="bottom-banner-darkening"
				src={layers.backgrounds.bottomBannerDarkening}
				in:fade={{ duration: 500 }}
				out:fade={{ duration: 500 }}
			/>
		</div>

		<div id="overlays" class="zstack">
			<img
				id="base"
				src={layers.overlays.base}
				in:fade={{ duration: 500 }}
				out:fade={{ duration: 500 }}
			/>

			<img
				id="match-base"
				src={layers.overlays.matchBase}
				in:fade={{ duration: 500 }}
				out:fade={{ duration: 500 }}
			/>

			<img
				id="results"
				src={layers.overlays.results}
				in:fade={{ duration: 500 }}
				out:fade={{ duration: 500 }}
			/>

			<img
				id="results-up-next"
				src={layers.overlays.resultsUpNext}
				in:fade={{ duration: 500 }}
				out:fade={{ duration: 500 }}
			/>

			<img
				id="bottom-banner"
				src={layers.overlays.bottomBanner}
				in:fade={{ duration: 500 }}
				out:fade={{ duration: 500 }}
			/>
		</div>

		<div id="videos" class="zstack">
			<video
				id="blue-wins-video"
				src={videos.blueWins}
				preload="auto"
				class:hidden={displayResultsVideo != DisplayResultsVideo.BLUE_WINS}
			></video>

			<video
				id="red-wins-video"
				src={videos.redWins}
				preload="auto"
				class:hidden={displayResultsVideo != DisplayResultsVideo.RED_WINS}
			></video>

			<video
				id="tie-video"
				src={videos.tie}
				preload="auto"
				class:hidden={displayResultsVideo != DisplayResultsVideo.TIE}
			></video>
		</div>
	</div>
</div>

<style>
	#frame {
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;

		#content {
			width: 100vw;
			height: calc(100vw / 16 * 9);
			overflow: hidden;

			& > * {
				width: 3840px;
				height: 2160px;
				transform-origin: top left;
				transform: scale(calc(100vw / 3840px));
			}

			@media (min-aspect-ratio: 16 / 9) {
				& {
					width: calc(100vh / 9 * 16);
					height: 100vh;
				}

				& > * {
					transform: scale(calc(100vh / 2160px));
				}
			}

			#overlays {
				filter: drop-shadow(0 8px 32px rgba(0, 0, 0, 0.5));
			}

			#videos > * {
				width: 100%;
				height: 100%;
				transition: opacity 500ms linear;
			}
		}
	}
</style>
