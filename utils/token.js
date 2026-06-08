const jwt = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
    profileImage: user.profileImage,
    isEmailVerified: user.isEmailVerified,
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: userData,
  });
};

module.exports = { generateToken, sendTokenResponse };
