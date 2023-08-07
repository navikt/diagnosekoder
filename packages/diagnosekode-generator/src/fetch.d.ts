// This file is a workaround because typescript typing for the new native node fetch is missing from @types/node.
// Can be removed when this is fixed. Should then also remove undici as a dependency, it is not actually used.
// https://stackoverflow.com/questions/71294230/how-can-i-use-native-fetch-with-node-in-typescript-node-v17-6
import * as undici_types from 'undici';

declare global {
    export const {
        fetch,
        FormData,
        Headers,
        Request,
        Response,
    }: typeof import('undici');

    type FormData = undici_types.FormData;
    type Headers = undici_types.Headers;
    type HeadersInit = undici_types.HeadersInit;
    type BodyInit = undici_types.BodyInit;
    type Request = undici_types.Request;
    type RequestInit = undici_types.RequestInit;
    type RequestInfo = undici_types.RequestInfo;
    type RequestMode = undici_types.RequestMode;
    type RequestRedirect = undici_types.RequestRedirect;
    type RequestCredentials = undici_types.RequestCredentials;
    type RequestDestination = undici_types.RequestDestination;
    type ReferrerPolicy = undici_types.ReferrerPolicy;
    type Response = undici_types.Response;
    type ResponseInit = undici_types.ResponseInit;
    type ResponseType = undici_types.ResponseType;
}