/**
 * Member 3 Feature: Appointment Scheduling & Dashboard Analytics
 * Endpoints:
 *   GET    /api/appointments
 *   POST   /api/appointments
 *   PATCH  /api/appointments/:id/status
 *   DELETE /api/appointments/:id
 *   GET    /api/appointments/dashboard/stats
 *   POST   /api/appointments/reset-seed
 */

const express = require('express');
const router = express.Router();
const { dbHelper } = require('../db/database');
const { seedDatabase } = require('../db/seed');

// GET appointments (supports ?owner_id=, ?status=, ?date=)
router.get('/', (req, res) => {
  try {
    const { owner_id, status, date } = req.query;
    const appointments = dbHelper.getAppointments({
      owner_id: owner_id ? Number(owner_id) : null,
      status: status || null,
      date: date || null
    });
    return res.json({ success: true, count: appointments.length, appointments });
  } catch (err) {
    console.error('[Get Appointments Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve appointments.' });
  }
});

// POST schedule a new appointment
router.post('/', (req, res) => {
  try {
    const { pet_id, owner_id, service_type, appointment_date, appointment_time, veterinarian, reason_notes, cost } = req.body;

    if (!pet_id || !service_type || !appointment_date || !appointment_time) {
      return res.status(400).json({
        success: false,
        message: 'Pet, service type, appointment date, and time are required.'
      });
    }

    const assignedOwnerId = owner_id || req.headers['x-user-id'] || 1;

    const appointment = dbHelper.createAppointment({
      pet_id: Number(pet_id),
      owner_id: Number(assignedOwnerId),
      service_type,
      appointment_date,
      appointment_time,
      veterinarian: veterinarian || 'Dr. K. Rahman (Chief Vet)',
      status: 'Scheduled',
      reason_notes: reason_notes || '',
      cost: cost ? Number(cost) : 35.0
    });

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      appointment
    });
  } catch (err) {
    console.error('[Create Appointment Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to create appointment.' });
  }
});

// PATCH update appointment status
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Scheduled', 'In-Progress', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updated = dbHelper.updateAppointmentStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    return res.json({
      success: true,
      message: `Appointment status updated to ${status}.`,
      appointment: updated
    });
  } catch (err) {
    console.error('[Update Appt Status Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to update appointment status.' });
  }
});

// DELETE cancel/delete appointment
router.delete('/:id', (req, res) => {
  try {
    const success = dbHelper.deleteAppointment(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }
    return res.json({ success: true, message: 'Appointment cancelled and removed successfully.' });
  } catch (err) {
    console.error('[Delete Appointment Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to delete appointment.' });
  }
});

// GET dashboard statistics & quick metrics
router.get('/dashboard/stats', (req, res) => {
  try {
    const { owner_id } = req.query;
    const stats = dbHelper.getDashboardStats(owner_id ? Number(owner_id) : null);
    return res.json({ success: true, stats });
  } catch (err) {
    console.error('[Dashboard Stats Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to generate dashboard statistics.' });
  }
});

// POST reset and reseed mock database
router.post('/reset-seed', (req, res) => {
  try {
    seedDatabase();
    return res.json({ success: true, message: 'Database refreshed with realistic sample dataset.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to reseed database.' });
  }
});

module.exports = router;
