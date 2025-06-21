export default class ParameterDefinition {

    constructor(
        readonly parameterIndex: number,
        readonly propertyKey: string,
        readonly type: ParameterType,
        readonly name?: string,
    ) {
    };

};

export enum ParameterType {
    PARAMS = 'PARAMS',
    BODY = 'BODY',
}
