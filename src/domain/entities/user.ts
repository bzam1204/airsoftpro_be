export default class User {
    private readonly _password: string;
    private readonly _fullName: string;
    private readonly _birth: Date;
    private readonly _photo: string;
    private readonly _email: string;
    private readonly _id: string;

    constructor(props: Props) {
        if (!this.isValidBirth(props.birth)) throw new Error('INVALID_BIRTH');
        this._password = props.password;
        this._fullName = props.fullName;
        this._birth = props.birth;
        this._photo = props.photo;
        this._email = props.email;
        this._id = props.id;
    };

    get password() {
        return this._password;
    };

    get email() {
        return this._email;
    }

    get id() {
        return this._id;
    };

    private isValidBirth(birth: Date, now: Date = new Date()) {
        return birth.getTime() < now.getTime();
    };

};

interface Props {
    password: string;
    fullName: string;
    birth: Date;
    email: string;
    photo: string;
    id: string;
}
