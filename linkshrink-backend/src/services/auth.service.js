const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");
const { signAccessToken } = require("../utils/jwt");

function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt
  };
}

async function register({ email, password, name }) {
  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  if (password.length < 8) {
    const error = new Error("Password must be at least 8 characters");
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name,
      passwordHash
    }
  });

  return {
    user: sanitizeUser(user),
    token: signAccessToken(user)
  };
}

async function login({ email, password }) {
  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  return {
    user: sanitizeUser(user),
    token: signAccessToken(user)
  };
}

module.exports = {
  register,
  login
};
