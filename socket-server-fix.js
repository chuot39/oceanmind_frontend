/*
 * ĐỀ XUẤT SỬA LỖI CHO SOCKET SERVER
 * 
 * Đây là phiên bản được cải tiến từ server.js của bạn, tập trung vào việc
 * sửa lỗi xử lý notification qua Socket.IO
 */

import dotenv from 'dotenv';
import app from './app.js';
import sequelize from './config/db.js';
import env from './config/env.js';
import { runSeeders, shouldRunSeeders } from './database/seeders/index.js';
import { Sequelize } from 'sequelize';
import setupAssociations from './models/associations.js';
import http from 'http';
import { Server as SocketIO } from 'socket.io';

dotenv.config();

const PORT = env.PORT || 3000;

// Tạo HTTP server riêng để gắn thêm Socket.IO
const server = http.createServer(app);

const io = new SocketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Lưu io vào app.locals để dùng trong controller nếu cần
app.locals.io = io;

// Lưu trạng thái typing của người dùng
const typingUsers = {};

// Lưu trữ user socket maps để theo dõi
const userSocketMap = {};

// Listen các sự kiện kết nối socket
io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    // Thêm xử lý sự kiện joinRoom cho cả conversationId và userId
    socket.on('joinRoom', (data) => {
        // Xử lý cho cả trường hợp joinRoom nhận string conversationId 
        // và trường hợp nhận object có userId cho notification
        if (typeof data === 'string') {
            // Đây là case cho chat rooms
            socket.join(data);
            console.log(`✅ Client ${socket.id} joined chat room ${data}`);
        } else if (data && (data.userId || data.roomName)) {
            // Đây là case cho notifications
            const userId = data.userId;
            // Ưu tiên sử dụng roomName được cung cấp, nếu không thì tạo từ userId
            const room = data.roomName || `user:${userId}`;

            // Lưu thông tin vào userSocketMap
            if (userId) {
                if (!userSocketMap[userId]) {
                    userSocketMap[userId] = new Set();
                }
                userSocketMap[userId].add(socket.id);
            }

            socket.join(room);
            console.log(`✅ Client ${socket.id} joined notification room ${room}`);

            // Thông báo cho client biết đã tham gia thành công
            socket.emit('roomJoined', {
                success: true,
                userId,
                room,
                message: `Successfully joined room ${room}`
            });
        }
    });

    // Thêm event để test room
    socket.on('testRoom', (data) => {
        if (!data || !data.roomName) {
            socket.emit('roomTestResult', {
                success: false,
                error: 'Missing roomName parameter'
            });
            return;
        }

        const roomName = data.roomName;
        const room = io.sockets.adapter.rooms.get(roomName);
        const socketIds = room ? Array.from(room) : [];

        console.log(`Testing room ${roomName}: ${socketIds.length} sockets in room`);

        // Thông báo cho client biết kết quả test
        socket.emit('roomTestResult', {
            success: true,
            roomName,
            socketCount: socketIds.length,
            socketIds,
            currentSocketId: socket.id,
            isInRoom: socketIds.includes(socket.id)
        });
    });

    socket.on("sendMessage", (message) => {
        const { conversationId } = message;
        console.log('📨 Broadcasting message:', message);
        socket.to(conversationId).emit("receiveMessage", message);
    });

    // Xử lý sự kiện typing
    socket.on("typing", (data) => {
        console.log('👩‍💻 User typing event:', data);
        const { conversationId, userId, isTyping } = data;

        // Lưu trạng thái đang gõ
        if (!typingUsers[conversationId]) {
            typingUsers[conversationId] = {};
        }
        typingUsers[conversationId][userId] = isTyping;

        // Phát sóng trạng thái typing đến những người dùng khác trong phòng
        socket.to(conversationId).emit("typing", data);
    });


    // Thêm xử lý sự kiện notification
    socket.on('notification', (data) => {
        // data có cấu trúc { recipientId: 'user-id', notification: {...} }
        console.log('📢 Received notification event:', data);

        if (data && data.recipientId) {
            const recipientId = data.recipientId;
            const room = `user:${recipientId}`;
            console.log(`Broadcasting notification to room ${room}:`, data);

            // Gửi thông báo đến tất cả clients trong room của user đó
            io.to(room).emit('notification', data);

            // Debug info: hiển thị các socket trong room
            const roomObj = io.sockets.adapter.rooms.get(room);
            const socketsInRoom = roomObj ? Array.from(roomObj) : [];
            console.log(`Room ${room} has ${socketsInRoom.length} sockets:`, socketsInRoom);

            // Thử gửi trực tiếp đến từng socket của user (nếu có trong map)
            if (userSocketMap[recipientId]) {
                const userSockets = Array.from(userSocketMap[recipientId]);
                console.log(`Directly sending to ${userSockets.length} sockets of user ${recipientId}:`, userSockets);

                userSockets.forEach(socketId => {
                    const targetSocket = io.sockets.sockets.get(socketId);
                    if (targetSocket) {
                        targetSocket.emit('notification', data);
                        targetSocket.emit('directNotification', data); // Thử thêm event khác
                        console.log(`Directly sent to socket ${socketId}`);
                    }
                });
            }

            // Phản hồi cho người gửi biết đã gửi thành công
            socket.emit('notificationSent', {
                success: true,
                recipientId,
                room,
                notification: data.notification
            });
        } else {
            console.error('Invalid notification data format:', data);
            socket.emit('notificationSent', {
                success: false,
                error: 'Invalid notification data format'
            });
        }
    });

    socket.on("disconnect", () => {
        console.log('❌ Client disconnected:', socket.id);

        // Xóa socket ID ra khỏi userSocketMap khi disconnect
        for (const userId in userSocketMap) {
            if (userSocketMap[userId].has(socket.id)) {
                userSocketMap[userId].delete(socket.id);
                console.log(`Removed socket ${socket.id} from user ${userId} map`);

                // Nếu không còn socket nào, xóa user khỏi map
                if (userSocketMap[userId].size === 0) {
                    delete userSocketMap[userId];
                    console.log(`User ${userId} has no active sockets, removed from map`);
                }
            }
        }
    });

    // Thêm endpoint để lấy thông tin rooms
    socket.on('getRooms', (data, callback) => {
        try {
            const rooms = {};
            // Lấy thông tin từ socket.io rooms
            for (const [roomName, room] of io.sockets.adapter.rooms.entries()) {
                // Bỏ qua những room tự động tạo cho mỗi socket
                if (!roomName.startsWith(socket.id)) {
                    rooms[roomName] = Array.from(room);
                }
            }

            // Thêm thông tin userSocketMap
            const result = {
                rooms,
                userSocketMap: Object.fromEntries(
                    Object.entries(userSocketMap).map(([userId, socketSet]) =>
                        [userId, Array.from(socketSet)]
                    )
                ),
                yourSocketId: socket.id,
                yourRooms: Array.from(socket.rooms).filter(room => room !== socket.id)
            };

            if (typeof callback === 'function') {
                callback(result);
            } else {
                socket.emit('roomsInfo', result);
            }
        } catch (error) {
            console.error('Error getting rooms info:', error);
            if (typeof callback === 'function') {
                callback({ error: error.message });
            } else {
                socket.emit('roomsInfo', { error: error.message });
            }
        }
    });
});

// Các hàm khác giữ nguyên...

// Start server
async function startServer() {
    const dbConnected = await assertDatabaseConnection();

    if (dbConnected) {
        // QUAN TRỌNG: Sử dụng server thay vì app để lắng nghe kết nối
        server.listen(PORT, () => {
            console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
        });
    } else {
        console.error('Failed to start server due to database connection issues');
        process.exit(1);
    }
}

// Giữ nguyên các hàm khác
async function assertDatabaseConnection() {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // Thiết lập các mối quan hệ giữa các model
        setupAssociations();

        // Check if tables exist (check users table as reference)
        const [results] = await sequelize.query(
            "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = ? AND table_name = 'users'",
            {
                replacements: [process.env.DB_NAME],
                type: Sequelize.QueryTypes.SELECT
            }
        );

        const tablesExist = results && results.table_count > 0;

        // Sync models with database (in development only)
        if (env.NODE_ENV === 'development') {
            if (!tablesExist) {
                // Tables don't exist, create them
                console.log('Tables do not exist, creating tables...');
                await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

                try {
                    // Force true only when tables don't exist
                    await sequelize.sync({ force: true });
                    console.log('🤖🤖 All models were synchronized successfully.');

                    // Run seeders in development mode only for new tables
                    await runSeeders();
                } finally {
                    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
                }
            } else {
                // Tables exist, no need to sync
                console.log('Tables already exist, skipping sync...');

                // Check if essential reference data is missing
                const needsSeeding = await shouldRunSeeders();
                if (needsSeeding) {
                    console.log('Essential reference data missing, running seeders...');
                    await runSeeders();
                }
            }
        }

        return true;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return false;
    }
}

startServer(); 