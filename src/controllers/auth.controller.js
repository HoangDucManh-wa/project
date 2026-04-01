import { register, login } from "../services/auth.service.js";
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
    return res.status(200).json({
      message: "login successful",
      loginData,
    });
  } catch (err) {
    return res.status(401).json({
      message: "login failed",
      error: err.message,
    });
  }
};
