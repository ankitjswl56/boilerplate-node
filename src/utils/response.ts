/* eslint-disable max-len */
import { Response } from 'express';

export type status_code = 200 | 201 | 202 | 204 | 301 | 302 | 400 | 401 | 402 | 403 | 404 | 409 | 413 | 500 | 502 | 503 | 504;
type status_message = {
  [key in status_code]: string;
}
type response_body = {
  status: {
    code: status_code;
    message: string;
  };
  result: any
}

const status_message: status_message = {
    200: 'Success',
    201: 'Created',
    202: 'Accepted',
    204: 'Processed, no content to display',
    301: 'Endpoint moved',
    302: 'Request can\'t be fullfiled',
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not found',
    409: 'Conflict',
    413: 'Payload too large',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
};

function response(status: status_code, result: any, res: Response) {
    const response_body: response_body = {
        status: {
            code: status,
            message: status_message[status],
        },
        result,
    };

    res.status(status).json(response_body).end();
}

function mongoose_error_handle(error: any, res: Response) {
    // console.log('mongoose_error_handle: error= ', error);

    if (error) {
    // to handle type CastError
        if (error.name === 'CastError') {
            return response(400, {
                field: error.path,
                value: error.value,
                message: 'Cast to ObjectId failed, Must be a single String of 12 bytes or a string of 24 hex characters',
                reason: 'Cast to ObjectId failed, Must be a single String of 12 bytes or a string of 24 hex characters',
            }, res);
        }

        // MongoDB Unique Error Code
        if (error.code === 11000) {
            const fieldName = Object.keys(error.keyValue)[0];

            return response(400, {
                field: fieldName,
                message: `'${fieldName}' should be Unique, '${error.keyValue[fieldName]}' already exists`,
                reason: `'${fieldName}' should be Unique, '${error.keyValue[fieldName]}' already exists`,
            }, res);
        }

        // to handle type any mongoose error
        let err: any = {};
        if (error && error.errors) {
            err = error;
        } else {
            err.errors = {};
            err.errors = error;
        }

        const keys = Object.keys(err.errors);
        keys.forEach((key) => {
            err.errors[key] = {
                field: key,
                message: err.errors[key] && err.errors[key].message ? err.errors[key].message : 'Message not availabe',
                reason: err.errors[key] && err.errors[key].reason ? err.errors[key].reason : 'Reason not available',
            };
        });
        return response(400, err.errors, res);
    // return response(400, { errors: err.errors, mongoose_error: error }, res);
    }
    return response(500, null, res);
}

export { response, mongoose_error_handle };
