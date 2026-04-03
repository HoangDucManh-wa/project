export const authorization = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        message: "You don't have this permission",
      });
    }
    next();
  };
};
