import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler((req, res) => {
  return res.status(200).json({
    message: "OK",
  });
});

export { registerUser };
