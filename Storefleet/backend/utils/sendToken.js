// Create token and save into cookie
export const sendToken = async (user, res, statusCode) => {
  const token = user.getJWTToken();
  console.log("Setting cookie with token:", token);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true, // Use `true` in production (HTTPS)
    sameSite: "None", // Required for cross-origin cookies
  };

  // Set only the token as cookie
  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImg: user.profileImg,
      },
      token,
    });
};
