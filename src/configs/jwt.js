// configs/jwt.js

export const jwtConfig = {
  secret: process.env.JWT_SECRET || "super_secret_key",
  accessTokenExpiresIn: "1d",
};
