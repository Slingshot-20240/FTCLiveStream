<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import {
		createInfoFromMessage,
		createScoresFromMessage,
		DisplayResultsVideo,
		type Info,
		type Scores
	} from '$lib/types';
	import { layers, audios, videos } from '$lib/assets';
	import { BannerState, MatchState, ResultsState, State } from '$lib/states';

	import MatchStateBaseBanners from '$lib/MatchStateBaseBanners.svelte';
	import Timer from '$lib/Timer.svelte';

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

	let grace = true;
	let latestInfoMessage: any;
	let latestScoresResultsMessage: any;

	let state: State;
	let matchState: MatchState;
	let resultsState: ResultsState;
	let bannerState: BannerState;

	let info: Info | null = null;
	let scores: Scores | null = null;
	let results: Scores | null = null;

	let ftcliveTs = Date.now();
	let localMs = performance.now();
	let timeSyncId = 0;

	let timer = 0;
	let interval: NodeJS.Timeout | undefined;
	let timeouts: NodeJS.Timeout[] = [];

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

		const params = new URLSearchParams(location.search);
		const host = params.get('host');
		const eventCode = params.get('eventCode');

		if (!host) {
			alert('FTCLive WebSocket host not provided. Please provide a "host" query parameter.');
			return;
		}

		if (!eventCode) {
			alert(
				'FTCLive WebSocket event code not provided. Please provide an "eventCode" query parameter.'
			);
			return;
		}

		const wsUrl = `ws://${host}/stream/display/command/?code=${eventCode}`;
		let ws = new WebSocket(wsUrl);

		ws.onopen = () => {
			grace = true;
			setTimeout(() => {
				grace = false;
				messageHandler({
					data: JSON.stringify(latestInfoMessage)
				} as MessageEvent);
				messageHandler({
					data: JSON.stringify(latestScoresResultsMessage)
				} as MessageEvent);
			}, 100);

			ws.send(`TIMESYNC:{"jsonrpc":"2.0","id":${timeSyncId},"method":"timesync"}`);
			setInterval(() => {
				timeSyncId++;
				ws.send(`TIMESYNC:{"jsonrpc":"2.0","id":${timeSyncId},"method":"timesync"}`);
			}, 30000);
		};

		ws.onmessage = messageHandler;

		ws.onclose = () => {
			location.reload();
		};
	});

	function messageHandler(event: MessageEvent) {
		let data = event.data as string;

		if (!data || data === 'pong') {
			return;
		}

		if (data.startsWith('TIMESYNC:')) {
			const message = JSON.parse(data.replace('TIMESYNC:', ''));
			if (message.result) {
				ftcliveTs = message.result;
				localMs = performance.now();
				console.log(`Time sync: ftcliveTs=${ftcliveTs}, localMs=${localMs}`);
			}
			return;
		}

		const message = JSON.parse(event.data);

		if (
			![
				'SHOW_PREVIEW',
				'SHOW_MATCH',
				'START_MATCH',
				'SCORE_UPDATE',
				'ABORT_MATCH',
				'SHOW_RESULTS'
			].includes(message.type)
		) {
			return;
		}

		console.log(message);

		switch (message.type) {
			case 'SHOW_PREVIEW':
			case 'SHOW_MATCH':
			case 'START_MATCH':
			case 'ABORT_MATCH':
				if (message.index < (latestInfoMessage?.index || 0)) {
					return;
				}
				latestInfoMessage = message;
				break;
			case 'SCORE_UPDATE':
			case 'SHOW_RESULTS':
				if (message.index < (latestScoresResultsMessage?.index || 0)) {
					return;
				}
				latestScoresResultsMessage = message;
				break;
		}

		if (grace) {
			return;
		}

		switch (message.type) {
			case 'SHOW_RESULTS':
				results = createScoresFromMessage(message);

				document.querySelectorAll('video').forEach((video) => {
					video.pause();
					video.currentTime = 0;
				});

				const blueTotal = results.blue.preFoulTotal + results.red.foulPointsCommitted;
				const redTotal = results.red.preFoulTotal + results.blue.foulPointsCommitted;

				if (blueTotal > redTotal) {
					displayResultsVideo = DisplayResultsVideo.BLUE_WINS;
					const video = document.getElementById('blue-wins-video') as HTMLVideoElement;
					video.currentTime = 0;
					video.play();
				} else if (redTotal > blueTotal) {
					displayResultsVideo = DisplayResultsVideo.RED_WINS;
					const video = document.getElementById('red-wins-video') as HTMLVideoElement;
					video.currentTime = 0;
					video.play();
				} else {
					displayResultsVideo = DisplayResultsVideo.TIE;
					const video = document.getElementById('tie-video') as HTMLVideoElement;
					video.currentTime = 0;
					video.play();
				}

				setTimeout(() => {
					state = State.RESULTS;
					resultsState = ResultsState.BASE;
					displayResultsVideo = DisplayResultsVideo.NONE;
					resultsAudio.currentTime = 0;
					resultsAudio.play();
				}, 7026);

				break;
			case 'SCORE_UPDATE':
				scores = createScoresFromMessage(message);
				break;
			default:
				info = createInfoFromMessage(message);

				switch (message.type) {
					case 'SHOW_PREVIEW':
						if ((results?.ts || 0) + 20000 < message.ts) {
							state = State.MATCH;
							matchState = MatchState.PREVIEW;
						} else {
							state = State.RESULTS;
							resultsState = ResultsState.UP_NEXT;
							displayResultsVideo = DisplayResultsVideo.NONE;
						}
						break;
					case 'SHOW_MATCH':
						state = State.MATCH;
						matchState = MatchState.AUTO;
						break;
					case 'START_MATCH':
						state = State.MATCH;
						matchState = MatchState.AUTO;
						startMatch(info);
						break;
					case 'ABORT_MATCH':
						state = State.MATCH;
						matchState = MatchState.ABORTED;
						abortMatch(info);
						break;
				}
		}

		console.log('processed message', message.index);
	}

	function startMatch(matchInfo: Info) {
		const offsetMs = ts() - matchInfo.ts;
		const offsetSec = Math.ceil(offsetMs / 1000);

		if (offsetSec > 158) {
			timer = 0;
			matchState = MatchState.FINISHED;
			return;
		}

		timer = 158 - offsetSec + 1;

		if (offsetSec > 138) {
			matchState = MatchState.ENDGAME;
		} else if (offsetSec > 38) {
			matchState = MatchState.TELEOP;
		} else if (offsetSec > 30) {
			matchState = MatchState.TRANSITION;
		} else if (offsetSec > 20) {
			matchState = MatchState.AUTO_END;
		} else {
			matchState = MatchState.AUTO;
		}

		if (offsetSec <= 1) {
			matchStartAudio.currentTime = 0;
			matchStartAudio.play();
		}

		const timeout = setTimeout(
			() => {
				if (info?.matchName != matchInfo.matchName || scores?.matchName != matchInfo.matchName) {
					return;
				}

				timer--;
				matchLoop();
			},
			offsetSec * 1000 - offsetMs
		);

		timeouts.push(timeout);
	}

	function matchLoop() {
		interval = setInterval(() => {
			if (timer > 0) {
				timer--;
			} else {
				clearInterval(interval);
			}

			if (timer <= 20) {
				if (matchState !== MatchState.ENDGAME) {
					endgameAudio.currentTime = 0;
					endgameAudio.play();
				}

				matchState = MatchState.ENDGAME;
			} else if (timer <= 120) {
				if (matchState !== MatchState.TELEOP) {
					teleopStartAudio.currentTime = 0;
					teleopStartAudio.play();
				}

				matchState = MatchState.TELEOP;
			} else if (timer <= 128) {
				if (matchState !== MatchState.TRANSITION) {
					autoEndAudio.currentTime = 0;
					autoEndAudio.play();

					const controllersTimeout = setTimeout(() => {
						pickUpControllersAudio.currentTime = 0;
						pickUpControllersAudio.play();
					}, 2000);
					timeouts.push(controllersTimeout);

					const countdownTimeout = setTimeout(() => {
						threeTwoOneAudio.currentTime = 0;
						threeTwoOneAudio.play();
					}, 5000);
					timeouts.push(countdownTimeout);
				}

				matchState = MatchState.TRANSITION;
			} else if (timer <= 138) {
				matchState = MatchState.AUTO_END;
			} else {
				matchState = MatchState.AUTO;
			}
		}, 1000);
	}

	function abortMatch(info: Info) {
		if (ts() - info.ts < 500) {
			clearInterval(interval);
			interval = undefined;

			timeouts.forEach((timeout) => clearTimeout(timeout));
			timeouts = [];

			abortAudio.currentTime = 0;
			abortAudio.play();
		}
	}

	function ts() {
		return ftcliveTs + (performance.now() - localMs);
	}
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<!-- svelte-ignore a11y_media_has_caption -->
<div id="frame">
	<div id="content" class="zstack">
		<div id="backgrounds" class="zstack">
			{#if state === State.MATCH && ![MatchState.PREVIEW, MatchState.ABORTED].includes(matchState)}
				<img
					id="match-base-darkening"
					src={layers.backgrounds.matchBaseDarkening}
					in:fade={{ duration: 500 }}
					out:fade={{ duration: 500 }}
				/>
			{/if}

			{#if state === State.RESULTS}
				<img
					id="results-darkening"
					src={layers.backgrounds.resultsDarkening}
					in:fade={{ duration: 500 }}
					out:fade={{ duration: 500 }}
				/>
			{/if}

			{#if state === State.BANNER}
				<img
					id="bottom-banner-darkening"
					src={layers.backgrounds.bottomBannerDarkening}
					in:fade={{ duration: 500 }}
					out:fade={{ duration: 500 }}
				/>
			{/if}
		</div>

		<div id="overlays" class="zstack">
			{#if state === State.MATCH}
				<div class="zstack" in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
					<img id="base" src={layers.overlays.base} />

					{#if ![MatchState.PREVIEW, MatchState.ABORTED].includes(matchState)}
						<img
							id="match-base"
							src={layers.overlays.matchBase}
							in:fade={{ duration: 500 }}
							out:fade={{ duration: 500 }}
						/>
					{/if}

					<MatchStateBaseBanners bind:matchState />

					<Timer bind:timer />
				</div>
			{/if}

			{#if state === State.RESULTS}
				<img
					id="results"
					src={layers.overlays.results}
					in:fade={{ duration: 500 }}
					out:fade={{ duration: 500 }}
				/>

				{#if resultsState === ResultsState.UP_NEXT}
					<img
						id="results-up-next"
						src={layers.overlays.resultsUpNext}
						in:fade={{ duration: 500 }}
						out:fade={{ duration: 500 }}
					/>
				{/if}
			{/if}

			{#if state === State.BANNER}
				<img
					id="bottom-banner"
					src={layers.overlays.bottomBanner}
					in:fade={{ duration: 500 }}
					out:fade={{ duration: 500 }}
				/>
			{/if}

			{#if state !== State.RESULTS}
				<img
					id="logo"
					src={layers.backgrounds.logo}
					in:fade={{ duration: 500 }}
					out:fade={{ duration: 500 }}
				/>
			{/if}
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
		}

		#backgrounds #results-darkening {
			backdrop-filter: blur(32px);
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
</style>
