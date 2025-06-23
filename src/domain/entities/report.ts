import ReportMotivation from '@/domain/enums/report-motivation';

export default class Report {
    private readonly motivation: ReportMotivation;
    private readonly _gameId: string;
    private readonly _from: string;
    private readonly _to: string;
    private readonly id: string;

    constructor({motivation, gameId, from, to, id}: Props) {
        this.motivation = motivation;
        this._gameId = gameId;
        this._from = from;
        this._to = to;
        this.id = id;
    };

    get gameId() {
        return this._gameId;
    };

    get from() {
        return this._from;
    };

    get to() {
        return this._to;
    };

};

interface Props {
    motivation: ReportMotivation;
    gameId: string;
    from: string;
    to: string;
    id: string;
}
