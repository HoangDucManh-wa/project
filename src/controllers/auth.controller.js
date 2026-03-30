import { register, login } from "../services/auth.service.js";
export async function registerController(req, res) {
  try {
    const data = req.body;
    const registerData = await register(data);
    return res.status(201).json({
      message: "Register successful",
      data: registerData,
    });
  } catch (err) {
    return res.status(500).json({
      message: "register failed",
      error: err.message,
    });
  }
}
export async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    const loginData = await login({ email, password });
    return res.status(200).json({
      message: "login successful",
      data: loginData,
    });
  } catch (err) {
    return res.status(401).json({
      message: "login failed",
      error: err.message,
    });
  }
}
