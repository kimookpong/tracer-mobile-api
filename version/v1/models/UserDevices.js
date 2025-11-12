const { generateUUID, toCamelCase } = require('../../../middleware/utils');
const { PrismaClient } = require('../../../prisma/generated/prisma');
const prisma = new PrismaClient();

module.exports = {
    async create(req, res) {
        try {
            const data = req.body;
            const dataForm = {
                user_id: data.userId,
                device_id: data.deviceId,
                device_token: data.deviceToken,
                device_type: data.deviceType,
                device_model: data.deviceModel,
                os_version: data.osVersion,
                app_version: data.appVersion,
            };
            // ค้นหา device_token เดิม
            const existing = await prisma.user_devices.findFirst({ where: { device_token: data.deviceToken, user_id: data.userId } });
            let device;
            if (existing) {
                device = await prisma.user_devices.update({
                    where: { id: existing.id },
                    data: dataForm,
                });
                res.status(200).json(device);
            } else {
                device = await prisma.user_devices.create({
                    data: { ...dataForm, id: generateUUID() },
                });
                res.status(201).json(toCamelCase(device));
            }
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async getAll(req, res) {
        try {
            const devices = await prisma.user_devices.findMany({ include: { user: true } });
            res.json(toCamelCase(devices));
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const device = await prisma.user_devices.findUnique({ where: { id }, include: { user: true } });
            if (!device) return res.status(404).json({ error: 'Not found' });
            res.json(toCamelCase(device));
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
};
