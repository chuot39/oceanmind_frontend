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

// Listen các sự kiện kết nối socket
io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    socket.on('joinRoom', (conversationId) => {
        socket.join(conversationId);
        console.log(`✅ Client ${socket.id} joined room ${conversationId}`);
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

    socket.on("disconnect", () => {
        console.log('❌ Client disconnected:', socket.id);
    });
});

// Test database connection
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

startServer(); 