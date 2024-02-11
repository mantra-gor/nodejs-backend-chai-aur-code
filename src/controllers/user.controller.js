import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // ? get user details from user
  // ? validation - not empty
  // ? check if user already exists: username, email
  // ? check for images, check for avatar
  // ? if available upload them to cloudinary, avatar
  // ? create user object - create entry in db
  // ? remove password and refresh token field from response
  // ? check for user creation
  // ? return response

  const { fullname, email, username, password } = req.body;
  console.log("email: ", email);

  //? validation
  //* basic code
  // if (fullname === "") {
  //   throw new ApiError(400, "Full Name is Required");
  // }

  //* advanced code
  if (
    [fullname, email, username, password].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //? check if user already exists: username, email
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "username or email is already exists");
  }

  //? check for images, check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path; //todo: log this req.files
  const coverImageLocalPath = req.field?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // ? if available upload them to cloudinary, avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // ? create user object - create entry in db
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.tolowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (createdUser) {
    throw new ApiError(500, "Something went wrong while registring the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

export { registerUser };
