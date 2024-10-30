// this file is created for the async wait syntax
// whenever the async funtion is write in any where for that we are type of there is a async are write 



// for many time we have to write a async function and for that  we are writing a long that why we are creted the this funtion to easy for async

// method -1 [promises]

const asyncHandler = (requestHandler) =>{
    return (req, res , next) => {
        Promise.resolve(requestHandler(req , res ,next)).catch((err) => next(err))
    }
}


// method -2 [try-catch]

// but here we use [higher functions] that is function between function

// example
// const asyncHandler = () => {}  this normal
// const asyncHandler = (func) => () => {}  function under the function
// const asyncHandler = (func)=> async () => {} this is async higher function


// const asyncHandler = (fn) => async (req ,res, next) =>{
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success : false,
//             message: err.message
//         })
//     }
// }



export { asyncHandler }