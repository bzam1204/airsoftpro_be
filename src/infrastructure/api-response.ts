export class SuccessResponse<T = any> {

    constructor(readonly code: number, readonly data: T) {
    };

}

export class ErrorResponse {

    constructor(readonly code: string) {
    };

}
