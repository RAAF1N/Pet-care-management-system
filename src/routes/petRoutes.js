/**
 * Member 2 Feature: Pet Profile & Medical Records Management
 * Endpoints:
 *   GET    /api/pets
 *   GET    /api/pets/:id
 *   POST   /api/pets
 *   PUT    /api/pets/:id
 *   DELETE /api/pets/:id
 *   POST   /api/pets/:id/vaccinations
 */

const express = require('express');
const router = express.Router();
const { dbHelper } = require('../db/database');

// GET all pets (supports ?owner_id=, ?species=, ?search=)
router.get('/', (req, res) => {
  try {
    const { owner_id, species, search } = req.query;
    const pets = dbHelper.getPets(owner_id || null, species || null, search || null);
    return res.json({ success: true, count: pets.length, pets });
  } catch (err) {
    console.error('[Get Pets Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve pets.' });
  }
});

// GET pet by ID with detailed health & vaccination records
router.get('/:id', (req, res) => {
  try {
    const pet = dbHelper.getPetById(req.params.id);
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet profile not found.' });
    }
    return res.json({ success: true, pet });
  } catch (err) {
    console.error('[Get Pet Details Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve pet profile.' });
  }
});

// POST create a new pet profile
router.post('/', (req, res) => {
  try {
    const {
      owner_id, name, species, breed, age, gender, weight,
      microchip_id, medical_notes, allergies, vaccination_status, avatar_url
    } = req.body;

    if (!name || !species || !breed || age === undefined || !gender || weight === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, species, breed, age, gender, and weight are required fields.'
      });
    }

    const assignedOwnerId = owner_id || req.headers['x-user-id'] || 1;

    // Default avatar if none provided
    let finalAvatar = avatar_url;
    if (!finalAvatar) {
      if (species.toLowerCase() === 'cat') {
        finalAvatar = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80';
      } else if (species.toLowerCase() === 'dog') {
        finalAvatar = 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80';
      } else if (species.toLowerCase() === 'rabbit') {
        finalAvatar = 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=400&q=80';
      } else {
        finalAvatar = 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=400&q=80';
      }
    }

    const newPet = dbHelper.createPet({
      owner_id: assignedOwnerId,
      name: name.trim(),
      species,
      breed: breed.trim(),
      age: Number(age),
      gender,
      weight: Number(weight),
      microchip_id: microchip_id ? microchip_id.trim() : '',
      medical_notes: medical_notes || '',
      allergies: allergies || '',
      vaccination_status: vaccination_status || 'Up-to-Date',
      avatar_url: finalAvatar
    });

    return res.status(201).json({
      success: true,
      message: 'Pet profile created successfully!',
      pet: newPet
    });
  } catch (err) {
    console.error('[Create Pet Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to create pet profile.' });
  }
});

// PUT update pet profile
router.put('/:id', (req, res) => {
  try {
    const existing = dbHelper.getPetById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Pet not found.' });
    }

    const updated = dbHelper.updatePet(req.params.id, {
      name: req.body.name || existing.name,
      species: req.body.species || existing.species,
      breed: req.body.breed || existing.breed,
      age: req.body.age !== undefined ? Number(req.body.age) : existing.age,
      gender: req.body.gender || existing.gender,
      weight: req.body.weight !== undefined ? Number(req.body.weight) : existing.weight,
      microchip_id: req.body.microchip_id !== undefined ? req.body.microchip_id : existing.microchip_id,
      medical_notes: req.body.medical_notes !== undefined ? req.body.medical_notes : existing.medical_notes,
      allergies: req.body.allergies !== undefined ? req.body.allergies : existing.allergies,
      vaccination_status: req.body.vaccination_status || existing.vaccination_status,
      avatar_url: req.body.avatar_url || existing.avatar_url
    });

    return res.json({
      success: true,
      message: 'Pet profile updated successfully!',
      pet: updated
    });
  } catch (err) {
    console.error('[Update Pet Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to update pet profile.' });
  }
});

// DELETE pet profile
router.delete('/:id', (req, res) => {
  try {
    const success = dbHelper.deletePet(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Pet not found or already deleted.' });
    }
    return res.json({ success: true, message: 'Pet profile deleted successfully.' });
  } catch (err) {
    console.error('[Delete Pet Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to delete pet profile.' });
  }
});

// POST add vaccination record for pet
router.post('/:id/vaccinations', (req, res) => {
  try {
    const { vaccine_name, administered_date, next_due_date, veterinarian, status } = req.body;
    if (!vaccine_name || !administered_date || !next_due_date) {
      return res.status(400).json({ success: false, message: 'Vaccine name, administered date, and next due date are required.' });
    }

    const vax = dbHelper.addVaccination(
      req.params.id,
      vaccine_name,
      administered_date,
      next_due_date,
      veterinarian || 'Attending Vet',
      status || 'Administered'
    );

    return res.status(201).json({
      success: true,
      message: 'Vaccination record registered.',
      vaccination: vax
    });
  } catch (err) {
    console.error('[Add Vax Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to add vaccination record.' });
  }
});

module.exports = router;
