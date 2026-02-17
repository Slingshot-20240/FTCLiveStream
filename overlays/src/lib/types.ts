/* eslint-disable @typescript-eslint/no-explicit-any */

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
                rank: message?.params?.blue?.teams[0]?.ranking || -99,
                leagueRank: message?.params?.blue?.teams[0]?.leagueRanking || -99,
                card: message?.params?.blue?.teams[0]?.carriesCard ? Card.YELLOW : Card.NONE,
                location: message?.params?.blue?.teams[0]?.location || '???',
            },
            {
                number: message?.params?.blue?.teams[1]?.number,
                name: message?.params?.blue?.teams[1]?.name || '???',
                rank: message?.params?.blue?.teams[1]?.ranking || -99,
                leagueRank: message?.params?.blue?.teams[1]?.leagueRanking || -99,
                card: message?.params?.blue?.teams[1]?.carriesCard ? Card.YELLOW : Card.NONE,
                location: message?.params?.blue?.teams[1]?.location || '???',
            },
        ],
        redTeams: [
            {
                number: message?.params?.red?.teams[0]?.number,
                name: message?.params?.red?.teams[0]?.name || '???',
                rank: message?.params?.red?.teams[0]?.ranking || -99,
                leagueRank: message?.params?.red?.teams[0]?.leagueRanking || -99,
                card: message?.params?.red?.teams[0]?.carriesCard ? Card.YELLOW : Card.NONE,
                location: message?.params?.red?.teams[0]?.location || '???',
            },
            {
                number: message?.params?.red?.teams[1]?.number,
                name: message?.params?.red?.teams[1]?.name || '???',
                rank: message?.params?.red?.teams[1]?.ranking || -99,
                leagueRank: message?.params?.red?.teams[1]?.leagueRanking || -99,
                card: message?.params?.red?.teams[1]?.carriesCard ? Card.YELLOW : Card.NONE,
                location: message?.params?.red?.teams[1]?.location || '???',
            },
        ],
    }
}

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
                rank: message?.params?.blue?.teams[0]?.ranking || -99,
                leagueRank: message?.params?.blue?.teams[0]?.leagueRanking || -99,
                card: message?.params?.blue?.teams[0]?.card || Card.NONE,
                location: message?.params?.blue?.teams[0]?.location || '???',
            },
            {
                number: message?.params?.blue?.teams[1]?.number,
                name: message?.params?.blue?.teams[1]?.name || '???',
                rank: message?.params?.blue?.teams[1]?.ranking || -99,
                leagueRank: message?.params?.blue?.teams[1]?.leagueRanking || -99,
                card: message?.params?.blue?.teams[1]?.card || Card.NONE,
                location: message?.params?.blue?.teams[1]?.location || '???',
            },
        ],
        redTeams: [
            {
                number: message?.params?.red?.teams[0]?.number,
                name: message?.params?.red?.teams[0]?.name || '???',
                rank: message?.params?.red?.teams[0]?.ranking || -99,
                leagueRank: message?.params?.red?.teams[0]?.leagueRanking || -99,
                card: message?.params?.red?.teams[0]?.card || Card.NONE,
                location: message?.params?.red?.teams[0]?.location || '???',
            },
            {
                number: message?.params?.red?.teams[1]?.number,
                name: message?.params?.red?.teams[1]?.name || '???',
                rank: message?.params?.red?.teams[1]?.ranking || -99,
                leagueRank: message?.params?.red?.teams[1]?.leagueRanking || -99,
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
    rank: number;
    leagueRank: number;
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