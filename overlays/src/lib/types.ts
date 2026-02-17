/* eslint-disable @typescript-eslint/no-explicit-any */

// MARK: - INFO MESSAGE

export type Info = {
    index: number;
    ts: number;
    matchName: string;
    blueTeams: Team[];
    redTeams: Team[];
}

export function createInfoFromMessage(message: any): Info {
    return {
        index: message.index,
        ts: message.ts,
        matchName: message?.params?.matchName || '???',
        blueTeams: [
            {
                number: message?.params?.blue?.teams[0]?.number,
                name: message?.params?.blue?.teams[0]?.name || '???',
                rank: message?.params?.blue?.teams[0]?.ranking,
                leagueRank: message?.params?.blue?.teams[0]?.leagueRanking,
                card: message?.params?.blue?.teams[0]?.carriesCard ? Card.YELLOW : Card.NONE,
                location: message?.params?.blue?.teams[0]?.location || '???',
            },
            {
                number: message?.params?.blue?.teams[1]?.number,
                name: message?.params?.blue?.teams[1]?.name || '???',
                rank: message?.params?.blue?.teams[1]?.ranking,
                leagueRank: message?.params?.blue?.teams[1]?.leagueRanking,
                card: message?.params?.blue?.teams[1]?.carriesCard ? Card.YELLOW : Card.NONE,
                location: message?.params?.blue?.teams[1]?.location || '???',
            },
        ],
        redTeams: [
            {
                number: message?.params?.red?.teams[0]?.number,
                name: message?.params?.red?.teams[0]?.name || '???',
                rank: message?.params?.red?.teams[0]?.ranking,
                leagueRank: message?.params?.red?.teams[0]?.leagueRanking,
                card: message?.params?.red?.teams[0]?.carriesCard ? Card.YELLOW : Card.NONE,
                location: message?.params?.red?.teams[0]?.location || '???',
            },
            {
                number: message?.params?.red?.teams[1]?.number,
                name: message?.params?.red?.teams[1]?.name || '???',
                rank: message?.params?.red?.teams[1]?.ranking,
                leagueRank: message?.params?.red?.teams[1]?.leagueRanking,
                card: message?.params?.red?.teams[1]?.carriesCard ? Card.YELLOW : Card.NONE,
                location: message?.params?.red?.teams[1]?.location || '???',
            },
        ],
    }
}

// MARK: - SCORES/RESULTS MESSAGE

export type Scores = {
    index: number;
    ts: number;
    matchName: string;
    blue: AllianceScores;
    red: AllianceScores;
    eventHighScore: boolean
    blueTeams: Team[];
    redTeams: Team[];
}

export function createScoresFromMessage(message: any): Scores {
    return {
        index: message.index,
        ts: message.ts,
        matchName: message?.params?.matchName || '???',
        blue: {
            auto: {
                classified: message?.params?.blueScores?.autoClassifiedArtifacts || 0,
                overflow: message?.params?.blueScores?.autoOverflowArtifacts || 0,
                motifs: (message?.params?.blueScores?.autoPatternPoints || 0) / 2,
                robot1Leave: message?.params?.blueScores?.robot1Auto || false,
                robot2Leave: message?.params?.blueScores?.robot2Auto || false,
            },
            teleop: {
                classified: message?.params?.blueScores?.teleopClassifiedArtifacts || 0,
                overflow: message?.params?.blueScores?.teleopOverflowArtifacts || 0,
                depot: message?.params?.blueScores?.teleopDepotArtifacts || 0,
                motifs: (message?.params?.blueScores?.teleopPatternPoints || 0) / 2,
                robot1Base: parseBaseFromString(message?.params?.blueScores?.robot1Teleop || ''),
                robot2Base: parseBaseFromString(message?.params?.blueScores?.robot2Teleop || ''),
            },
            minorFouls: message?.params?.blueScores?.minorFouls || 0,
            majorFouls: message?.params?.blueScores?.majorFouls || 0,
            foulPointsCommitted: message?.params?.blueScores?.foulPointsCommitted || 0,
            preFoulTotal: message?.params?.blueScores?.preFoulTotal || 0,
            movementRP: message?.params?.blueScores?.movementRP || false,
            goalRP: message?.params?.blueScores?.goalRP || false,
            patternRP: message?.params?.blueScores?.patternRP || false,
            violations: message?.params?.blueScores?.violations || [],
        },
        red: {
            auto: {
                classified: message?.params?.redScores?.autoClassifiedArtifacts || 0,
                overflow: message?.params?.redScores?.autoOverflowArtifacts || 0,
                motifs: (message?.params?.redScores?.autoPatternPoints || 0) / 2,
                robot1Leave: message?.params?.redScores?.robot1Auto || false,
                robot2Leave: message?.params?.redScores?.robot2Auto || false,
            },
            teleop: {
                classified: message?.params?.redScores?.teleopClassifiedArtifacts || 0,
                overflow: message?.params?.redScores?.teleopOverflowArtifacts || 0,
                depot: message?.params?.redScores?.teleopDepotArtifacts || 0,
                motifs: (message?.params?.redScores?.teleopPatternPoints || 0) / 2,
                robot1Base: parseBaseFromString(message?.params?.redScores?.robot1Teleop || ''),
                robot2Base: parseBaseFromString(message?.params?.redScores?.robot2Teleop || ''),
            },
            minorFouls: message?.params?.redScores?.minorFouls || 0,
            majorFouls: message?.params?.redScores?.majorFouls || 0,
            foulPointsCommitted: message?.params?.redScores?.foulPointsCommitted || 0,
            preFoulTotal: message?.params?.redScores?.preFoulTotal || 0,
            movementRP: message?.params?.redScores?.movementRP || false,
            goalRP: message?.params?.redScores?.goalRP || false,
            patternRP: message?.params?.redScores?.patternRP || false,
            violations: message?.params?.redScores?.violations || [],
        },
        eventHighScore: message?.params?.blueHighScore || message?.params?.redHighScore || false,
        blueTeams: [
            {
                number: message?.params?.blue?.teams[0]?.number,
                name: message?.params?.blue?.teams[0]?.name || '???',
                rank: message?.params?.blue?.teams[0]?.ranking,
                leagueRank: message?.params?.blue?.teams[0]?.leagueRanking,
                card: message?.params?.blue?.teams[0]?.card || Card.NONE,
                location: message?.params?.blue?.teams[0]?.location || '???',
            },
            {
                number: message?.params?.blue?.teams[1]?.number,
                name: message?.params?.blue?.teams[1]?.name || '???',
                rank: message?.params?.blue?.teams[1]?.ranking,
                leagueRank: message?.params?.blue?.teams[1]?.leagueRanking,
                card: message?.params?.blue?.teams[1]?.card || Card.NONE,
                location: message?.params?.blue?.teams[1]?.location || '???',
            },
        ],
        redTeams: [
            {
                number: message?.params?.red?.teams[0]?.number,
                name: message?.params?.red?.teams[0]?.name || '???',
                rank: message?.params?.red?.teams[0]?.ranking,
                leagueRank: message?.params?.red?.teams[0]?.leagueRanking,
                card: message?.params?.red?.teams[0]?.card || Card.NONE,
                location: message?.params?.red?.teams[0]?.location || '???',
            },
            {
                number: message?.params?.red?.teams[1]?.number,
                name: message?.params?.red?.teams[1]?.name || '???',
                rank: message?.params?.red?.teams[1]?.ranking,
                leagueRank: message?.params?.red?.teams[1]?.leagueRanking,
                card: message?.params?.red?.teams[1]?.card || Card.NONE,
                location: message?.params?.red?.teams[1]?.location || '???',
            },
        ],
    }
}

export type AllianceScores = {
    auto: AutoScores
    teleop: TeleopScores
    minorFouls: number
    majorFouls: number
    foulPointsCommitted: number
    preFoulTotal: number
    movementRP: boolean
    goalRP: boolean
    patternRP: boolean
    violations: Violation[]
}

export type AutoScores = {
    classified: number
    overflow: number
    motifs: number
    robot1Leave: boolean
    robot2Leave: boolean
}

export type TeleopScores = {
    classified: number
    overflow: number
    depot: number
    motifs: number
    robot1Base: Base
    robot2Base: Base
}

export enum Base {
    NONE, PARTIAL, FULL
}

export function parseBaseFromString(base: string): Base {
    switch (base) {
        case 'PARTIAL':
            return Base.PARTIAL;
        case 'FULL':
            return Base.FULL;
        default:
            return Base.NONE;
    }
}

export enum Violation {
    G417A = "G417.A",
    G418A = "G418.A",
    G418B = "G418.B",
    G419B = "G419.B",
    G206 = "G206",
    G431C = "G431.C"
}

export type Team = {
    number: string;
    name: string;
    rank?: number;
    leagueRank?: number;
    card: Card;
    location: string;
}

export enum Card {
    NONE = 0,
    YELLOW = 1,
    RED = 2
}

export enum DisplayResultsVideo {
    NONE, BLUE_WINS, RED_WINS, TIE
}

export enum Alliance {
    BLUE, RED
}

export enum NumericScoreBadgeType {
    CLASSIFIED, OVERFLOW, DEPOT, PATTERN
}

// MARK: - ALLIANCE SELECTION MESSAGE

export interface AllianceSelection {
    index: number;
    ts: number;
    alliances: Team[][];
    picking: number;
    finished: boolean;
}

export function createAllianceSelectionFromMessage(message: any): AllianceSelection {
    const alliances: Team[][] = message?.params?.state?.alliances.map((alliance: number[]) => {
        return alliance.map(number => {
            const team = message?.params?.state?.teams.find((t: any) => t.number === number);
            return {
                number: team?.displayNumber || '???',
                name: team?.name || '???',
                rank: team?.rank,
                leagueRank: -99,
                card: Card.NONE,
                location: '???',
            }
        });
    });

    const picking = Math.floor(message?.params?.state?.nextSlot / 2) || 0;

    return {
        index: message.index,
        ts: message.ts,
        alliances: alliances,
        picking: picking,
        finished: message?.params?.state?.immutable || picking >= alliances.length || false,
    }
}

// MARK: - AWARDS MESSAGE

export interface Award {
    index: number;
    ts: number;
    name: string;
    isTeamAward: boolean;
    winners: AwardWinner[];
    presenting: number[];
}

export function createAwardFromMessage(message: any): Award {
    const isTeamAward = message?.params?.award?.isTeamAward || true;

    const winners: AwardWinner[] = message?.params?.assignments.map((assignment: any) => {
        if (isTeamAward) {
            return {
                place: assignment?.place || 0,
                team: {
                    number: assignment?.teamNumber || '???',
                    name: assignment?.teamName || '???',
                    card: Card.NONE,
                    location: assignment?.teamLocation || '???',
                }
            }
        }

        return {
            place: assignment?.place || 0,
            individualName: assignment?.name || '???',
        }
    });

    return {
        index: message.index,
        ts: message.ts,
        isTeamAward: isTeamAward,
        name: message?.params?.award?.name || '???',
        winners: winners,
        presenting: message?.params?.place || 0,
    }
}

export interface AwardWinner {
    place: number;
    team?: Team;
    individualName?: string;
}

// MARK: - ADVANCEMENTS MESSAGE

export interface Advancements {
    index: number;
    ts: number;
    advancingTo: string;
    count: number;
    teams: Team[];
    presenting: number[];
}

export function createAdvancementsFromMessage(message: any): Advancements {
    const teams: Team[] = message?.params?.list.map((data: any) => {
        const team = data?.points?.teamData

        const locArray: string[] = [team?.city, team?.state, team?.country].filter((loc) => loc);
        const location = locArray.join(', ');

        return {
            number: team?.displayNumber || '???',
            name: team?.name || '???',
            card: Card.NONE,
            location: location,
        }
    });

    return {
        index: message.index,
        ts: message.ts,
        advancingTo: message?.params?.config?.advancesTo || '???',
        count: message?.params?.config?.advancementCount || Infinity,
        teams: teams,
        presenting: message?.params?.index || -1,
    }
}