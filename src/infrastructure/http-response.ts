export default interface HttpResponse<TBody> {
    statusCode: number;
    body?: TBody;
};
