
const axios = require("axios");
const { PrismaClient } = require('../prisma/generated/prisma');

function toCamelCase(obj) {
  if (Array.isArray(obj)) {
    return obj.map((v) => toCamelCase(v));
  } else if (obj && typeof obj === "object" && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
}

// generate format like this "f6d11824-682f-4145-bb4f-d65c2921cd6c"
function generateUUID() {
  return "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateRandomNumber(length) {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function generateRandomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// generate F240001 F is type Farms,Farmers,Users,Cows 24 is current year 0001 is Running number
function generateTracerId(type, runningNumber) {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  return `${type}${currentYear}${runningNumber}`;
}



async function sendPushNotification(userId, title, body, route, params = {}) {
  try {
    const prisma = new PrismaClient();
    // หา device_token ทั้งหมดของ userId
    const devices = await prisma.user_devices.findMany({
      where: { user_id: userId },
      select: { device_token: true },
    });
    const tokens = devices.map(d => d.device_token).filter(Boolean);
    if (tokens.length === 0) {
      console.log('No device tokens found for user:', userId);
      return null;
    }
    // ส่ง push notification เป็นกลุ่ม
    const messages = tokens.map(token => ({
      to: token,
      sound: 'default',
      title,
      body,
      data: { route, params },
      priority: 'high',
      channelId: 'default',
    }));
    const response = await axios.post(
      'https://exp.host/--/api/v2/push/send',
      messages,
      {
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Push notification sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
}

async function createNotification({ userId, type = "ACCOUNT", title, body, route = null, image = null }) {
  const prisma = new PrismaClient();
  const dataForm = {
    id: generateUUID(),
    user_id: userId,
    type,
    title,
    body,
    route,
    image,
  };
  const notification = await prisma.notifications.create({ data: dataForm });
  sendPushNotification(userId, title, body, route, {});
  return notification;
}

function NotificationType() {
  return [{
    type: 'TRANSFER',
    title: 'เคลื่อนย้าย',
  }, {
    type: 'ORDER',
    title: 'ซื้อขาย',
  }, {
    type: 'ACCOUNT',
    title: 'บัญชีผู้ใช้งาน',
  }, {
    type: 'SICK',
    title: 'โคป่วย',
  }, {
    type: 'NEWS',
    title: 'ข่าวสาร',
  }]
}

module.exports = {
  toCamelCase,
  generateUUID,
  generateTracerId,
  generateRandomNumber,
  generateRandomString,
  sendPushNotification,
  NotificationType,
  createNotification,
};
