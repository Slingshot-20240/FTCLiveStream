<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import {
		createAdvancementsFromMessage,
		createAllianceSelectionFromMessage,
		createAwardFromMessage,
		createInfoFromMessage,
		createScoresFromMessage,
		DisplayResultsVideo,
		type Advancements,
		type AllianceSelection,
		type Award,
		type Info,
		type Scores
	} from '$lib/types';
	import { layers, audios, videos } from '$lib/assets';
	import { BannerState, MatchState, ResultsState, State } from '$lib/states';

	import '$lib/PositionBlock.svelte';
	import MatchStateBaseBanners from '$lib/MatchStateBaseBanners.svelte';
	import Timer from '$lib/Timer.svelte';
	import TimerStateText from '$lib/TimerStateText.svelte';
	import Teams from '$lib/Teams.svelte';
	import Scoreboard from '$lib/Scoreboard.svelte';
	import MatchScoreBadges from '$lib/MatchScoreBadges.svelte';
	import MatchBaseEventInfo from '$lib/MatchBaseEventInfo.svelte';
	import MatchBaseMatchName from '$lib/MatchBaseMatchName.svelte';
	import ResultsBanners from '$lib/ResultsBanners.svelte';
	import ResultsScoreboard from '$lib/ResultsScoreboard.svelte';
	import ResultsViolations from '$lib/ResultsViolations.svelte';
	import Cards from '$lib/Cards.svelte';
	import AllianceSelectionBanner from '$lib/AllianceSelectionBanner.svelte';
	import AwardsBanner from '$lib/AwardsBanner.svelte';
	import AdvancementsBanner from '$lib/AdvancementsBanner.svelte';

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

	let host: string;
	let eventCode: string;
	let eventRegion: string;
	let eventLevel: string;

	let grace = true;
	let latestInfoMessage: any;
	let latestScoresResultsMessage: any;
	let latestAllianceSelectionMessage: any;
	let latestAwardMessage: any;
	let latestAdvancementMessage: any;
	let latestIndex: number = -1;

	let state: State;
	let matchState: MatchState;
	let resultsState: ResultsState;
	let bannerState: BannerState;

	let info: Info | null = null;
	let scores: Scores | null = null;
	let results: Scores | null = null;
	let allianceSelection: AllianceSelection | null = null;
	let award: Award | null = null;
	let advancements: Advancements | null = null;

	let ftcliveTs = Date.now();
	let localMs = performance.now();
	let timeSyncId = 0;

	let timer = 0;
	let interval: NodeJS.Timeout | undefined;
	let timeouts: NodeJS.Timeout[] = [];

	let showPitDisplay = false;

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
		const unsafeHost = params.get('host');
		const unsafeEventCode = params.get('code');
		eventRegion = params.get('region') || '???';
		eventLevel = params.get('level') || '???';

		if (!unsafeHost) {
			alert('FTCLive WebSocket host not provided. Please provide a "host" query parameter.');
			return;
		}

		if (!unsafeEventCode) {
			alert(
				'FTCLive WebSocket event code not provided. Please provide an "eventCode" query parameter.'
			);
			return;
		}

		host = unsafeHost;
		eventCode = unsafeEventCode;

		const wsUrl = `ws://${host}/stream/display/command/?code=${eventCode}`;
		let ws = new WebSocket(wsUrl);

		ws.onopen = () => {
			grace = true;
			setTimeout(() => {
				grace = false;
				processMessage(latestAdvancementMessage);
				processMessage(latestAwardMessage);
				processMessage(latestAllianceSelectionMessage);
				processMessage(latestScoresResultsMessage);
				processMessage(latestInfoMessage);
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

		if (message.index < latestIndex) return;

		if (
			![
				'SHOW_PREVIEW',
				'SHOW_MATCH',
				'START_MATCH',
				'SCORE_UPDATE',
				'ABORT_MATCH',
				'SHOW_RESULTS',
				'SHOW_SELECTION',
				'SHOW_AWARD',
				'SHOW_ADVANCEMENT'
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
				if (
					message.params?.number < latestScoresResultsMessage?.params?.number &&
					message.params?.tournamentLevel === latestScoresResultsMessage?.params?.tournamentLevel
				) {
					return;
				}
			case 'SHOW_RESULTS':
				if (message.index < (latestScoresResultsMessage?.index || 0)) {
					return;
				}
				latestScoresResultsMessage = message;
				break;
			case 'SHOW_SELECTION':
				if (message.index < (latestAllianceSelectionMessage?.index || 0)) {
					return;
				}

				let lhs = JSON.parse(JSON.stringify(latestAllianceSelectionMessage || {}));
				let rhs = JSON.parse(JSON.stringify(message));

				lhs.index = 0;
				lhs.ts = 0;
				rhs.index = 0;
				rhs.ts = 0;

				if (JSON.stringify(lhs) === JSON.stringify(rhs)) {
					return;
				}

				latestAllianceSelectionMessage = message;
				break;
			case 'SHOW_AWARD':
				if (message.index < (latestAwardMessage?.index || 0)) {
					return;
				}
				latestAwardMessage = message;
				break;
			case 'SHOW_ADVANCEMENT':
				if (message.index < (latestAdvancementMessage?.index || 0)) {
					return;
				}
				latestAdvancementMessage = message;
				break;
		}

		if (grace) return;

		processMessage(message);
	}

	function processMessage(message: any) {
		if (!message) return;
		if (message.index < latestIndex) return;

		switch (message.type) {
			case 'SHOW_ADVANCEMENT':
				advancements = createAdvancementsFromMessage(message);
				state = State.BANNER;
				bannerState = BannerState.ADVANCEMENTS;
				break;
			case 'SHOW_AWARD':
				award = createAwardFromMessage(message);
				state = State.BANNER;
				bannerState = BannerState.AWARDS;
				break;
			case 'SHOW_SELECTION':
				allianceSelection = createAllianceSelectionFromMessage(message);
				state = State.BANNER;
				bannerState = BannerState.ALLIANCE_SELECTION;
				break;
			case 'SHOW_RESULTS':
				results = createScoresFromMessage(message);

				document.querySelectorAll('video').forEach((video) => {
					video.pause();
					video.currentTime = 0;
				});

				if (ts() - results.ts < 500) {
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
				} else {
					state = State.RESULTS;
					resultsState = ResultsState.BASE;
					displayResultsVideo = DisplayResultsVideo.NONE;
				}

				break;
			case 'SCORE_UPDATE':
				scores = createScoresFromMessage(message);
				break;
			default:
				info = createInfoFromMessage(message);

				switch (message.type) {
					case 'SHOW_PREVIEW':
						if (info.index < (results?.index || 0)) {
							return;
						}

						if ((results?.ts || 0) + 27026 < ts()) {
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
						matchState = MatchState.SHOW_MATCH;
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

		latestIndex = message.index;
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
			if (timer > 1) {
				timer--;
			} else {
				timer--;
				matchEndAudio.play();
				matchState = MatchState.FINISHED;
				clearInterval(interval);
				return;
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
			{#if [State.MATCH, State.RESULTS].includes(state)}
				<div class="zstack" in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
					<img id="base" src={layers.overlays.base} />

					<MatchBaseEventInfo bind:region={eventRegion} bind:level={eventLevel} />

					<Cards bind:state bind:info bind:results />
				</div>
			{/if}

			{#if state === State.MATCH}
				<div class="zstack" in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
					<MatchBaseMatchName bind:info results={null} />

					<Teams bind:info results={null} position="top" />

					<MatchStateBaseBanners bind:matchState bind:scores />

					{#if ![MatchState.PREVIEW, MatchState.ABORTED].includes(matchState)}
						<img
							id="match-base"
							src={layers.overlays.matchBase}
							in:fade={{ duration: 500 }}
							out:fade={{ duration: 500 }}
						/>
					{/if}

					{#if ![MatchState.PREVIEW, MatchState.ABORTED].includes(matchState)}
						<MatchScoreBadges bind:matchState bind:scores />

						<div class="zstack" in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
							<Scoreboard bind:scores />
							<Timer bind:timer bind:matchState />
							<TimerStateText bind:matchState />
						</div>
					{/if}
				</div>
			{/if}

			{#if state === State.RESULTS}
				<div class="zstack" in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
					<MatchBaseMatchName info={null} bind:results />

					<Teams info={null} bind:results position="top" />

					<ResultsViolations bind:results />

					<ResultsBanners bind:results />

					<img id="results" src={layers.overlays.results} />

					<ResultsScoreboard bind:results />

					{#if resultsState === ResultsState.UP_NEXT}
						<div class="full-frame zstack" in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
							<img id="results-up-next" src={layers.overlays.resultsUpNext} />

							<Teams bind:info results={null} position="bottom" />
						</div>
					{/if}
				</div>
			{/if}

			{#if state === State.BANNER}
				<div class="zstack" in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
					<img id="bottom-banner" src={layers.overlays.bottomBanner} />

					{#if bannerState === BannerState.ALLIANCE_SELECTION}
						<AllianceSelectionBanner
							bind:as={allianceSelection}
							eventName={eventRegion + ' ' + eventLevel}
						/>
					{:else if bannerState === BannerState.AWARDS}
						<AwardsBanner bind:award eventName={eventRegion + ' ' + eventLevel} />
					{:else if bannerState === BannerState.ADVANCEMENTS}
						<AdvancementsBanner bind:advancements eventName={eventRegion + ' ' + eventLevel} />
					{/if}
				</div>
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

		<iframe
			src="http://{host}/event/{eventCode}/display/?type=pit"
			frameborder="0"
			class:hidden={!showPitDisplay}
		></iframe>
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
			background-color: rgba(0, 0, 0, 0.8);
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

		iframe {
			transition: opacity 500ms linear;
		}
	}
</style>
