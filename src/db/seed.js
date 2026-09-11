const { dbHelper } = require('./database');

function seedDatabase() {
  console.log('[Seed] Seeding sample data for Pet Care Management System MVP...');

  // Check if users already exist
  const existingUsers = dbHelper.getAllUsers();
  let ownerUser, staffUser;

  if (existingUsers.length === 0) {
    ownerUser = dbHelper.createUser(
      'Sarah Jenkins',
      'sarah.owner@petcare.com',
      'password123',
      'owner',
      '+880 1712-345678'
    );
    staffUser = dbHelper.createUser(
      'Dr. K. Rahman (Chief Vet)',
      'dr.rahman@petcare.com',
      'password123',
      'staff',
      '+880 1819-876543'
    );
    console.log('[Seed] Default users created.');
  } else {
    ownerUser = existingUsers.find(u => u.role === 'owner') || existingUsers[0];
    staffUser = existingUsers.find(u => u.role === 'staff') || existingUsers[0];
  }

  // Check if pets exist
  const existingPets = dbHelper.getPets();
  if (existingPets.length === 0 && ownerUser) {
    const pet1 = dbHelper.createPet({
      owner_id: ownerUser.id,
      name: 'Max',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: 3,
      gender: 'Male',
      weight: 31.5,
      microchip_id: 'CHIP-98421-BD',
      medical_notes: 'Active, healthy. Mild seasonal pollen allergy in springtime.',
      allergies: 'Spring pollen',
      vaccination_status: 'Up-to-Date',
      avatar_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80'
    });

    const pet2 = dbHelper.createPet({
      owner_id: ownerUser.id,
      name: 'Luna',
      species: 'Cat',
      breed: 'Siamese',
      age: 2,
      gender: 'Female',
      weight: 4.3,
      microchip_id: 'CHIP-10293-BD',
      medical_notes: 'Indoor cat. Regular coat grooming recommended. Sensitive stomach.',
      allergies: 'Chicken poultry meal',
      vaccination_status: 'Due Soon',
      avatar_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80'
    });

    const pet3 = dbHelper.createPet({
      owner_id: ownerUser.id,
      name: 'Rocky',
      species: 'Dog',
      breed: 'German Shepherd',
      age: 5,
      gender: 'Male',
      weight: 35.0,
      microchip_id: 'CHIP-44921-BD',
      medical_notes: 'Guard trained. Scheduled for annual rabies booster.',
      allergies: 'None',
      vaccination_status: 'Overdue',
      avatar_url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5455?auto=format&fit=crop&w=400&q=80'
    });

    const pet4 = dbHelper.createPet({
      owner_id: ownerUser.id,
      name: 'Milo',
      species: 'Rabbit',
      breed: 'Holland Lop',
      age: 1,
      gender: 'Male',
      weight: 1.8,
      microchip_id: 'CHIP-77210-BD',
      medical_notes: 'Dental health checked quarterly. High fiber timothy hay diet.',
      allergies: 'None',
      vaccination_status: 'Up-to-Date',
      avatar_url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=400&q=80'
    });

    // Add Vaccinations
    dbHelper.addVaccination(pet1.id, 'Rabies Booster', '2025-10-15', '2026-10-15', 'Dr. K. Rahman', 'Administered');
    dbHelper.addVaccination(pet1.id, 'DHPP Core Vaccine', '2025-08-10', '2026-08-10', 'Dr. K. Rahman', 'Administered');

    dbHelper.addVaccination(pet2.id, 'FVRCP (Feline Viral)', '2025-09-20', '2026-09-20', 'Dr. K. Rahman', 'Administered');
    dbHelper.addVaccination(pet2.id, 'Rabies (1-Year)', '2024-09-12', '2025-09-12', 'Dr. K. Rahman', 'Overdue');

    dbHelper.addVaccination(pet3.id, 'Bordetella (Kennel Cough)', '2025-04-10', '2026-04-10', 'Dr. K. Rahman', 'Administered');
    dbHelper.addVaccination(pet3.id, 'Rabies Booster', '2024-06-01', '2025-06-01', 'Dr. K. Rahman', 'Overdue');

    // Add Appointments
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    dbHelper.createAppointment({
      pet_id: pet3.id,
      owner_id: ownerUser.id,
      service_type: 'Vaccination',
      appointment_date: today,
      appointment_time: '11:00 AM',
      veterinarian: 'Dr. K. Rahman',
      status: 'Scheduled',
      reason_notes: 'Urgent Rabies booster and general vitality examination.',
      cost: 45.0
    });

    dbHelper.createAppointment({
      pet_id: pet1.id,
      owner_id: ownerUser.id,
      service_type: 'Grooming & Spa',
      appointment_date: tomorrow,
      appointment_time: '02:30 PM',
      veterinarian: 'PetCare Spa Specialist',
      status: 'Scheduled',
      reason_notes: 'De-shedding bath, nail trimming, and ear cleaning.',
      cost: 35.0
    });

    dbHelper.createAppointment({
      pet_id: pet2.id,
      owner_id: ownerUser.id,
      service_type: 'General Checkup',
      appointment_date: nextWeek,
      appointment_time: '10:15 AM',
      veterinarian: 'Dr. K. Rahman',
      status: 'Scheduled',
      reason_notes: 'Stomach sensitivity follow-up and dietary advice.',
      cost: 50.0
    });

    dbHelper.createAppointment({
      pet_id: pet4.id,
      owner_id: ownerUser.id,
      service_type: 'Dental Cleaning',
      appointment_date: '2026-08-20',
      appointment_time: '09:00 AM',
      veterinarian: 'Dr. K. Rahman',
      status: 'Completed',
      reason_notes: 'Routine incisor length evaluation completed successfully.',
      cost: 40.0
    });

    console.log('[Seed] Sample pets, vaccinations, and appointments populated successfully.');
  }
}

module.exports = { seedDatabase };
