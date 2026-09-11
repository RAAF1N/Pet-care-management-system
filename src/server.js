const express = require('express');
const path = require('path');
const { initSchema } = require('./db/database');
const { seedDatabase } = require('./db/seed');

const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database schema and seed initial demo data
initSchema();
seedDatabase();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));
app.use('/docs', express.static(path.join(__dirname, '..', 'docs')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/appointments', appointmentRoutes);

// Catch-all fallback route for Single Page Application
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('====================================================');
    console.log('🐾 PET CARE MANAGEMENT SYSTEM (MVP) - CSE 3206 LAB 2');
    console.log('====================================================');
    console.log(`🚀 Server running at: http://localhost:${PORT}`);
    console.log(`📁 Process Model: Prototype Software Model`);
    console.log(`👥 Team Size: 3 Members (Collaborative Git Architecture)`);
    console.log('====================================================');
  });
}

module.exports = app;
