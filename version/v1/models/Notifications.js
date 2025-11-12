const { PrismaClient } = require("../../../prisma/generated/prisma");
const {
    toCamelCase,
    generateUUID,
} = require("../../../middleware/utils");
const prisma = new PrismaClient();

module.exports = {
    async create(req, res) {
        try {
            const data = req.body;
            const dataForm = {
                user_id: data.userId,
                type: data.type || "ACCOUNT",
                title: data.title,
                body: data.body,
                route: data.route || null,
                image: data.image || null,
            };
            const notification = await prisma.notifications.create({ data });
            res.status(201).json(toCamelCase(notification));
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async getAll(req, res) {
        try {
            const notifications = await prisma.notifications.findMany({ include: { user: true } });
            res.json(toCamelCase(notifications));
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const notification = await prisma.notifications.findUnique({ where: { id }, include: { user: true } });
            if (!notification) return res.status(404).json({ error: 'Not found' });
            res.json(toCamelCase(notification));
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async getByUser(req, res) {
        try {
            const { userId } = req.params;
            const notifications = await prisma.notifications.findMany({ where: { user_id: userId }, orderBy: { created_at: 'desc' } });
            res.json(toCamelCase(notifications));
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async markAsRead(req, res) {
        try {
            const { id } = req.params;
            const notification = await prisma.notifications.update({ where: { id }, data: { read_flag: true } });
            res.json(toCamelCase(notification));
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async countUnread(req, res) {
        try {
            const { userId } = req.params;
            const count = await prisma.notifications.count({
                where: {
                    user_id: userId,
                    read_flag: false,
                },
            });
            res.json(toCamelCase({ userId, unread: count }));
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
};
