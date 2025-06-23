export class DomainException extends Error {

    constructor(public readonly code: string) {
        super(code);
    };

}

export class AuthException extends Error {

    constructor(public readonly code: string) {
        super(code);
    };

}
