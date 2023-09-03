export class CustomError extends Error {
    code?: string
    statusCode?: number
    data?: object
    
    constructor (message: string, code?: string, statusCode: number = 500, data?: object) {
        super(message)

        this.name = 'CustomError'
        this.message = message
        this.code = code
        this.statusCode = statusCode
        this.data = data
    }
}

export type CustomErrorParams = {
  message: string
  code?: string
  statusCode?: number
  data?: object
}

export type CustomErrorParams2 = {
  code: string
  status: string
  message: string
  data?: object
}

const customError = ({
  message,
  code,
  statusCode,
  data,
}: CustomErrorParams) => {
  throw new CustomError(message, code, statusCode, data);
};

// const customError2 = ({
//   message,
//   code,
//   status,
//   data,
// }: CustomErrorParams2) => {
//   throw new CustomError(message, code, status, data);
// };

export default customError