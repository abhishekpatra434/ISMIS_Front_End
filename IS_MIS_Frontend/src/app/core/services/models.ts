
export interface IApiResponse {
    data?: any;
    Data?: any;
    metadata?: any;
    MetaData?: any;
    result?: any;
}

export interface IModel {
    status: number,
    message: string
    operation: string,
	errorList:any,
	description:any,
	data:any
}
 