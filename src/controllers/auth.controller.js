import {
  register,
  login,
  forgotPassword,
  updatePassword,
} from "../services/auth.service.js";
export const registerController = async (req, res) => {
  try {
    const data = req.body;
    const registerData = await register(data);
    const { user, token } = registerData;
    res.cookie("token", token, {
      httpOnly: true,
      samesite: "lax",
      secure: false, //dev
    });
    return res.status(201).json({
      message: "register successful",
      user,
    });
  } catch (err) {
    return res.status(400).json({
      message: "register failed",
      error: err.message,
    });
  }
};
export const loginController = async (req, res) => {
  try {
    const data = req.body;
    const { email, password } = data;
    const loginData = await login({ email, password });
    const { token, user } = loginData;
    res.cookie("token", token, {
      httpOnly: true,
      samesite: "lax",
      secure: false, // dev
    });
    return res.status(200).json({
      message: "login successful",
      user,
    });
  } catch (err) {
    return res.status(401).json({
      message: "login failed",
      error: err.message,
    });
  }
};
export const logoutController = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // dev
  });
  res.json({
    message: "Logout successful",
  });
};
export const forgotPasswordController = async (req, res) => {
  try {
    const email = req.body.email;
    await forgotPassword(email);
    return res.status(200).json({
      message: "forgot password successful",
    });
  } catch (err) {
    return res.status(500).json({
      message: "forgot password failed",
      error: err.message,
    });
  }
};
export const updatePasswordController = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const userId = await updatePassword(token, newPassword);
    return res.status(200).json({
      message: "update password successful",
      data: userId,
    });
  } catch (err) {
    return res.status(500).json({
      message: "update password failed",
      error: err.message,
    });
  }
};
