export interface ExecutionContext<TRequest, TResponse> {
    getResponse(): TResponse;

    getRequest(): TRequest;
}
