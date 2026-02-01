import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import db from './db/config';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS - Allow all origins for development
app.use(cors({
  origin: '*', // Or specify your frontend URL like 'http://localhost:3000'
  credentials: true
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Skynet EPR API is running' });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Error:', err);
  console.error('Stack:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Test database connection before starting server
async function startServer() {
  try {
    // Test database connection
    await db.raw('SELECT 1');
    console.log('PostgreSQL connected successfully');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:5000/api`);
      console.log(`CORS enabled for all origins`);
      console.log(`Database: ${process.env.DB_NAME || 'airman_db'}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL:', error);
    process.exit(1);
  }
}

startServer();

export default app;