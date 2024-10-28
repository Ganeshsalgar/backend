// this is for the response syntax handling in the multiple files 

// for many time we have to write a response function and for that  we are writing a long thats why we are created the this function to easy for response handling 

//for handling the response by only the making class


class ApiResponse {
    constructor(statusCode, data , message = "Success"){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400 // this is the server code  for the problem identification 
    }
}

export { ApiResponse }