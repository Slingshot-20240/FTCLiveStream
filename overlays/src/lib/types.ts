export type Info = {
    index: number;
    matchName: string;
    blueTeams: Team[];
    redTeams: Team[];
}

export type Scores = {
    index: number
    matchName: string;
    blue: AllianceScores
    red: AllianceScores
    blueTeams: Team[];
    redTeams: Team[];
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
}

export type AutoScores = {
    classified: number
    overflow: number
    robot1Leave: boolean
    robot2Leave: boolean
}

export type TeleopScores = {
    classified: number
    overflow: number
    depot: number
    robot1Base: Base
    robot2Base: Base
}

export enum Base {
    NONE, PARTIAL, FULL
}

export type Team = {
    number: string;
    name: string;
    rank: number;
    leagueRank: number;
    location: string;
}

export enum DisplayResultsVideo {
    NONE, BLUE_WINS, RED_WINS, TIE
}