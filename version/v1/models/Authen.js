const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("../../../prisma/generated/prisma");
const prisma = new PrismaClient();

exports.checkToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res
        .status(400)
        .json({ status: "error", error: "Token is required" });
    }
    const user = await prisma.user.findFirst({
      where: { token: token },
    });
    if (!user) {
      return res.status(404).json({ status: "error", error: "User not found" });
    }
    return res.status(200).json({
      status: "success",
      message: "Token is valid",
      user: user,
    });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { body } = req;
    if (!body.token) {
      return res
        .status(400)
        .json({ status: "error", error: "Token is required" });
    }
    const data = await prisma.user.findFirst({
      where: { token: body.token },
    });
    let user = data;
    if (!data) {
      user = {
        id: uuidv4(),
        token: body.token,
        user_id: null,
        type: null,
        last_login: new Date(),
        approve_status: "SIGNUP",
      };
      await prisma.user.create({ data: user });
    } else {
      await prisma.user.update({
        where: { id: data.id },
        data: { last_login: new Date() },
      });
    }
    const accessToken = jwt.sign(user, process.env.JWT_TOKEN_SECRET);

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: user,
      accessToken: accessToken,
      userId: user.id,
    });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

exports.loginTest = async (req, res, next) => {
  try {
    const { body } = req;
    if (!body.token) {
      return res
        .status(400)
        .json({ status: "error", error: "Token is required" });
    }
    const data = await prisma.user.findFirst({
      where: { token: body.token },
    });
    let user = data;
    if (!data) {
      user = {
        id: uuidv4(),
        token: body.token,
        role_id: body.roleId,
        first_name: "นายสมชาย",
        last_name: "ใจดี",
        mobile_number: "0812345678",
        user_id: null,
        type: null,
        last_login: new Date(),
        approve_status: "SIGNUP",
      };
      await prisma.user.create({ data: user });
    } else {
      await prisma.user.update({
        where: { id: data.id },
        data: { last_login: new Date(), role_id: body.roleId },
      });
    }
    const accessToken = jwt.sign(user, process.env.JWT_TOKEN_SECRET);

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: user,
      accessToken: accessToken,
      userId: user.id,
    });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({ status: "success", message: "Logout successful" });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

exports.register = async (req, res, next) => {
  try {
    const { body } = req;

    const data = await prisma.user.update({
      where: { id: body.userId },
      data: {
        birth_date: body.birthDate || null,
        company_id: body.companyId,
        company_name: body.companyName,
        email: body.email,
        first_name: body.firstName,
        id_card: body.idCard,
        last_name: body.lastName,
        line_id: body.lineId,
        mobile_number: body.mobileNumber,
        nationality_id: body.nationalityId,
        office_number: body.officeNumber,
        role_id: body.roleId,
        title_name: body.titleName,
        type_id: body.typeId,
        avatar: body.avatar || null,
        approve_status: "PENDING",
      },
    });

    res.status(200).json({
      status: "success",
      message: "Registration successful",
      data: data,
    });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};
