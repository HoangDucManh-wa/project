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
    return res.status(201).json({
      message: "register successful",
      registerData,
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
    const { token, userId } = loginData;
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // dev
    });
    return res.status(200).json({
      message: "login successful",
      userId,
    });
  } catch (err) {
    return res.status(401).json({
      message: "login failed",
      error: err.message,
    });
  }
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
