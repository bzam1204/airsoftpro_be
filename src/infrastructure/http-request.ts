export default interface HttpRequest<TBody = any, TParams = any> {
    headers: any;
    params: TParams;
    body: TBody;
    user?: any;
};
