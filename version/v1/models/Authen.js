const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("../../../prisma/generated/prisma");
const prisma = new PrismaClient();

exports.login = async (req, res, next) => {
  try {
    const { body } = req;
    if (!body.token) {
      return res.status(400).json({ error: "Token is required" });
    }
    const data = await prisma.user.findFirst({
      where: { token: body.token },
    });
    let user = data;
    if (!data) {
      user = {
        id: uuidv4(),
        token: body.token,
        type: null,
      };
      const addNew = await prisma.user.create({ data: user });
    }
    const accessToken = jwt.sign(user, process.env.JWT_TOKEN_SECRET);

    res.status(200).json({
      message: "Login successful",
      data: data,
      accessToken: accessToken,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.register = async (req, res, next) => {
  try {
    const data = await prisma.admins.findMany();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
