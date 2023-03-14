export interface Pack {
    author: string;
    name:   string;
    rounds: Round[];
}

export interface Round {
    name:   string;
    themes: Theme[];
}

export interface Theme {
    name:        string;
    description: string;
    ordered:     boolean;
    questions:   Question[];
}

export interface Question {
    id:           string;
    price?:       Price;
    type:         QuestionType;
    rules?:       Rule[];
    after_round?: Rule[];
}

export interface Rule {
    type:            RuleType;
    content?:        string;
    duration?:       number;
    path?:           string;
}

export interface Price {
    text:         string;
    correct:      number;
    incorrect:    number;
    random_range: RandomRange;
}

export interface RandomRange {
    min: number;
    max: number;
}

export enum QuestionType {
    Normal = 'normal',
    Secret = 'secret',
    Self = 'self',
    Empty = 'empty',
}
export enum RuleType {
    App = 'app',
    Embedded = 'embedded',
}