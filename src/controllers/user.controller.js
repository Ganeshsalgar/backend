import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshTokesns = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {accessToken , refreshToken}
    } catch (error) {
        throw new ApiError(500 , "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // Step 1: Get user details from frontend
    const { fullName, email, username, password } = req.body;
    console.log("fullName:", fullName);
    console.log("email:", email);
    console.log("username:", username);
    console.log("password:", password);

    // Step 2: Validate that no fields are empty
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Step 3: Check if user already exists (by username or email)
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });
    
    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    // Step 4: Upload images if provided, and check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   


    // Step 5: Create user object and add entry to the database
    const user = await User.create({
        fullName,
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    });

    // Step 6 & 7: Remove password and refresh token from response, and check for user creation
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Step 8: Return response
    return res.status(201).json({
        status: 200,
        data: createdUser,
        message: "User registered successfully"
    });
});



//*****************************************user Login **************** */

const loginUser = asyncHandler(async (req, res) => {
    // request body -> data
    // username or email
    // find user exist 
    // check password 
    // access and refresh token
    // send cookies


    // request body -> data
    const {username , email, password} = req.body;

    
    
    // username or email
    if (!username && !email) {
        throw new ApiError(400 , "username and email is required !!")
    }

    // check the user is exist

    const user = await User.findOne({
        $or : [{username} , {email}]
    })


    if (!user) {
        throw new ApiError(404 , "user does not exist !!")
    }

    // check the valid password
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401 , "Password is Incorrect")
    }
    
    const {accessToken , refreshToken } = await generateAccessAndRefreshTokesns(user._id)

    const LoggedInUser = await User.findById(user._id).select("-password -refreshToken")


    // SEND THE COOKIES 

    const options = {
        httpOnly : true,
        secure : true
    }


    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: LoggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})


//*****************************************user Logout **************** */

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async(req , res) => {
    const incomingREfreshToken = req.cookie.refreshToken || req.body.refreshToken

    if(!incomingREfreshToken) {
        throw new ApiError(401 , "unauthorized request")
    }

    try{
        const decodedToken = jwt.verify(
            incomingREfreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if(!user){
            throw new ApiError(401 , "Invalid refresh token")
        }

        if(incomingREfreshToken !== user?.refreshToken){
            throw new ApiError(401 , "Refresh token is expired or used")
        }


        const options = {
            httpOnly : true,
            secure : true
        }


        const {accessToken , newrefreshToken} = await generateAccessAndRefreshTokesns(user._id)


        return res
        .status(200)
        .cookie("accessToken", accessToken , options)
        .cookie("refreshToken", newrefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newrefreshToken},
                "Access Token Refreshed"
            )
        )
    }catch (error) {
        throw new ApiError(401 , error?.message || "Invalid refresh token")
    }
})








export { 
    registerUser,
    loginUser,
    logoutUser, 
};
