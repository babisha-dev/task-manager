/**
 * Task Manager — Node.js + Express + MySQL (Sequelize)
 * Main server entry point
 */

const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const rateLimit   = require('express-rate-limit');
require('dotenv').config();

const { sequelize, syncDatabase } = require('./models');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Security ──────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));

// ── Body parsing ──────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Rate limiting ─────────────────────────────────────────
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
}));

// ── Routes ────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ success: true, message: 'Server healthy', db: 'MySQL connected' });
  } catch {
    res.status(500).json({ success: false, message: 'DB not connected' });
  }
});

app.use('/api/auth',  require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => res.json({ message: 'Task Manager API (MySQL)' }));

// ── 404 ───────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// ── Error handler ─────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    // Test MySQL connection
    await sequelize.authenticate();
    console.log('✅ MySQL connected');

    // Sync tables (creates or alters them to match models)
    await syncDatabase();

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════╗
║  🚀 Task Manager Server (MySQL)                ║
║  Port  : ${PORT}                                  ║
║  Mode  : ${process.env.NODE_ENV || 'development'}                       ║
║  DB    : MySQL / Sequelize                     ║
╚════════════════════════════════════════════════╝`);
    });
  } catch (err) {
    console.error('❌ Startup failed:', err.message);
    console.error('💡 Check your .env DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
    process.exit(1);
  }
};

start();

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  process.exit(1);
});
