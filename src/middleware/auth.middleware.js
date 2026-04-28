import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ msg: "No token provided" });
    }


    const token = header.split(' ')[1];


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

export default authMiddleware;