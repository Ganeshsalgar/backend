// this is for the error syntax handling in the multiple files 

// for many time we have to write a error function and for that  we are writing a long thats why we are created the this function to easy for error handling 

//for handling the error by only the making class

class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {ApiError}