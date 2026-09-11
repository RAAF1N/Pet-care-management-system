const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'petcare.sqlite');
let db = null;
let useNativeSqlite = false;

try {
  const { DatabaseSync } = require('node:sqlite');
  db = new DatabaseSync(DB_PATH);
  useNativeSqlite = true;
  console.log('[Database] Connected to SQLite database at:', DB_PATH);
} catch (err) {
  console.warn('[Database] Native SQLite not available, falling back to JSON storage mode:', err.message);
}

// Fallback JSON-based store if native sqlite is unavailable
const JSON_STORE_PATH = path.join(__dirname, 'petcare_fallback.json');

function initSchema() {
  if (useNativeSqlite) {
    db.exec(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'owner',
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS pets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        owner_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        species TEXT NOT NULL,
        breed TEXT NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL,
        weight REAL NOT NULL,
        microchip_id TEXT,
        medical_notes TEXT,
        allergies TEXT,
        vaccination_status TEXT DEFAULT 'Up-to-Date',
        avatar_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS vaccinations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pet_id INTEGER NOT NULL,
        vaccine_name TEXT NOT NULL,
        administered_date TEXT NOT NULL,
        next_due_date TEXT NOT NULL,
        veterinarian TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Administered',
        FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pet_id INTEGER NOT NULL,
        owner_id INTEGER NOT NULL,
        service_type TEXT NOT NULL,
        appointment_date TEXT NOT NULL,
        appointment_time TEXT NOT NULL,
        veterinarian TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Scheduled',
        reason_notes TEXT,
        cost REAL DEFAULT 0.0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('[Database] Relational schema initialized successfully.');
  } else {
    if (!fs.existsSync(JSON_STORE_PATH)) {
      fs.writeFileSync(JSON_STORE_PATH, JSON.stringify({ users: [], pets: [], vaccinations: [], appointments: [] }, null, 2));
    }
  }
}

// Universal database helper API
const dbHelper = {
  isNative: () => useNativeSqlite,
  getRawDb: () => db,

  // Users
  findUserByEmail: (email) => {
    if (useNativeSqlite) {
      const stmt = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)');
      return stmt.get(email);
    }
    const store = JSON.parse(fs.readFileSync(JSON_STORE_PATH, 'utf8'));
    return store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  findUserById: (id) => {
    if (useNativeSqlite) {
      const stmt = db.prepare('SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?');
      return stmt.get(id);
    }
    const store = JSON.parse(fs.readFileSync(JSON_STORE_PATH, 'utf8'));
    const user = store.users.find(u => u.id === Number(id));
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  createUser: (name, email, password, role = 'owner', phone = '') => {
    if (useNativeSqlite) {
      const stmt = db.prepare('INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)');
      const res = stmt.run(name, email, password, role, phone);
      return dbHelper.findUserById(res.lastInsertRowid);
    }
    const store = JSON.parse(fs.readFileSync(JSON_STORE_PATH, 'utf8'));
    const id = store.users.length > 0 ? Math.max(...store.users.map(u => u.id)) + 1 : 1;
    const newUser = { id, name, email, password, role, phone, created_at: new Date().toISOString() };
    store.users.push(newUser);
    fs.writeFileSync(JSON_STORE_PATH, JSON.stringify(store, null, 2));
    const { password: _, ...safeUser } = newUser;
    return safeUser;
  },

  getAllUsers: () => {
    if (useNativeSqlite) {
      const stmt = db.prepare('SELECT id, name, email, role, phone FROM users');
      return stmt.all();
    }
    const store = JSON.parse(fs.readFileSync(JSON_STORE_PATH, 'utf8'));
    return store.users.map(({ password, ...rest }) => rest);
  },

  // Pets
  getPets: (ownerId = null, species = null, search = null) => {
    if (useNativeSqlite) {
      let sql = `
        SELECT p.*, u.name as owner_name, u.phone as owner_phone
        FROM pets p
        JOIN users u ON p.owner_id = u.id
        WHERE 1=1
      `;
      const params = [];
      if (ownerId) {
        sql += ' AND p.owner_id = ?';
        params.push(ownerId);
      }
      if (species && species !== 'All') {
        sql += ' AND LOWER(p.species) = LOWER(?)';
        params.push(species);
      }
      if (search) {
        sql += ' AND (LOWER(p.name) LIKE ? OR LOWER(p.breed) LIKE ?)';
        params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
      }
      sql += ' ORDER BY p.id DESC';
      const stmt = db.prepare(sql);
      return stmt.all(...params);
    }
    // Fallback
    const store = JSON.parse(fs.readFileSync(JSON_STORE_PATH, 'utf8'));
    return store.pets.filter(p => {
      if (ownerId && p.owner_id !== Number(ownerId)) return false;
      if (species && species !== 'All' && p.species.toLowerCase() !== species.toLowerCase()) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.breed.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }).map(p => {
      const owner = store.users.find(u => u.id === p.owner_id) || {};
      return { ...p, owner_name: owner.name, owner_phone: owner.phone };
    }).reverse();
  },

  getPetById: (id) => {
    if (useNativeSqlite) {
      const stmt = db.prepare(`
        SELECT p.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone
        FROM pets p
        JOIN users u ON p.owner_id = u.id
        WHERE p.id = ?
      `);
      const pet = stmt.get(id);
      if (!pet) return null;
      const vaxStmt = db.prepare('SELECT * FROM vaccinations WHERE pet_id = ? ORDER BY id DESC');
      pet.vaccinations = vaxStmt.all(id);
      return pet;
    }
    const store = JSON.parse(fs.readFileSync(JSON_STORE_PATH, 'utf8'));
    const pet = store.pets.find(p => p.id === Number(id));
    if (!pet) return null;
    const owner = store.users.find(u => u.id === pet.owner_id) || {};
    const vaccinations = (store.vaccinations || []).filter(v => v.pet_id === pet.id);
    return { ...pet, owner_name: owner.name, owner_email: owner.email, owner_phone: owner.phone, vaccinations };
  },

  createPet: (petData) => {
    const { owner_id, name, species, breed, age, gender, weight, microchip_id, medical_notes, allergies, vaccination_status, avatar_url } = petData;
    if (useNativeSqlite) {
      const stmt = db.prepare(`
        INSERT INTO pets (owner_id, name, species, breed, age, gender, weight, microchip_id, medical_notes, allergies, vaccination_status, avatar_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const res = stmt.run(
        owner_id, name, species, breed, age, gender, weight,
        microchip_id || null, medical_notes || '', allergies || '',
        vaccination_status || 'Up-to-Date', avatar_url || null
      );
      return dbHelper.getPetById(res.lastInsertRowid);
    }
    const store = JSON.parse(fs.readFileSync(JSON_STORE_PATH, 'utf8'));
    const id = store.pets.length > 0 ? Math.max(...store.pets.map(p => p.id)) + 1 : 1;
    const newPet = {
      id, owner_id: Number(owner_id), name, species, breed, age: Number(age), gender, weight: Number(weight),
      microchip_id: microchip_id || '', medical_notes: medical_notes || '', allergies: allergies || '',
      vaccination_status: vaccination_status || 'Up-to-Date', avatar_url: avatar_url || '',
      created_at: new Date().toISOString()
    };
    store.pets.push(newPet);
    fs.writeFileSync(JSON_STORE_PATH, JSON.stringify(store, null, 2));
    return dbHelper.getPetById(id);
  },

  updatePet: (id, petData) => {
    const { name, species, breed, age, gender, weight, microchip_id, medical_notes, allergies, vaccination_status, avatar_url } = petData;
    if (useNativeSqlite) {
      const stmt = db.prepare(`
        UPDATE pets
        SET name = ?, species = ?, breed = ?, age = ?, gender = ?, weight = ?,
            microchip_id = ?, medical_notes = ?, allergies = ?, vaccination_status = ?, avatar_url = ?
        WHERE id = ?
      `);
      stmt.run(name, species, breed, age, gender, weight, microchip_id, medical_notes, allergies, vaccination_status, avatar_url, id);
      return dbHelper.getPetById(id);
    }
    const store = JSON.parse(fs.readFileSync(JSON_STORE_PATH, 'utf8'));
    const idx = store.pets.findIndex(p => p.id === Number(id));
    if (idx === -1) return null;
    store.pets[idx] = { ...store.pets[idx], ...petData };
    fs.writeFileSync(JSON_STORE_PATH, JSON.stringify(store, null, 2));
    return dbHelper.getPetById(id);
  },

  deletePet: (id) => {
    if (useNativeSqlite) {
      const stmt = db.prepare('DELETE FROM pets WHERE id = ?');
      const res = stmt.run(id);
      return res.changes > 0;
    }
    const store = JSON.parse(fs.readFileSync(JSON_STORE_PATH, 'utf8'));
    const initialLen = store.pets.length;
    store.pets = store.pets.filter(p => p.id !== Number(id));
    store.appointments = store.appointments.filter(a => a.pet_id !== Number(id));
    store.vaccinations = (store.vaccinations || []).filter(v => v.pet_id !== Number(id));
    fs.writeFileSync(JSON_STORE_PATH, JSON.stringify(store, null, 2));
    return store.pets.length < initialLen;
  },

  // Appointments
  getAppointments: (filter = {}) => {
    const { owner_id, status, date } = filter;
    if (useNativeSqlite) {
      let sql = `
        SELECT a.*, p.name as pet_name, p.species as pet_species, p.breed as pet_breed,
               u.name as owner_name, u.phone as owner_phone, u.email as owner_email
        FROM appointments a
        JOIN pets p ON a.pet_id = p.id
        JOIN users u ON a.owner_id = u.id
        WHERE 1=1
      `;
      const params = [];
      if (owner_id) {
        sql += ' AND a.owner_id = ?';
        params.push(owner_id);
      }
      if (status && status !== 'All') {
        sql += ' AND a.status = ?';
        params.push(status);
      }
      if (date) {
        sql += ' AND a.appointment_date = ?';
        params.push(date);
      }
      sql += ' ORDER BY a.appointment_date ASC, a.appointment_time ASC';
      const stmt = db.prepare(sql);
      return stmt.all(...params);
    }
    const store = JSON.parse(fs.readFileSync(JSON_STORE_PATH, 'utf8'));
    return store.appointments.filter(a => {
      if (owner_id && a.owner_id !== Number(owner_id)) return false;
      if (status && status !== 'All' && a.status !== status) return false;
      if (date && a.appointment_date !== date) return false;
      return true;
    }).map(a => {
      const pet = store.pets.find(p => p.id === a.pet_id) || {};
      const owner = store.users.find(u => u.id === a.owner_id) || {};
      return {
        ...a,
        pet_name: pet.name,
        pet_species: pet.species,
        pet_breed: pet.breed,
        owner_name: owner.name,
        owner_phone: owner.phone,
        owner_email: owner.email
      };
    });
  },

  createAppointment: (data) => {
    const { pet_id, owner_id, service_type, appointment_date, appointment_time, veterinarian, status, reason_notes, cost } = data;
    if (useNativeSqlite) {
      const stmt = db.prepare(`
        INSERT INTO appointments (pet_id, owner_id, service_type, appointment_date, appointment_time, veterinarian, status, reason_notes, cost)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const res = stmt.run(
        pet_id, owner_id, service_type, appointment_date, appointment_time,
        veterinarian, status || 'Scheduled', reason_notes || '', cost || 0.0
      );
      const getStmt = db.prepare('SELECT * FROM appointments WHERE id = ?');
      return getStmt.get(res.lastInsertRowid);
    }
    const store = JSON.parse(fs.readFileSync(JSON_STORE_PATH, 'utf8'));
    const id = store.appointments.length > 0 ? Math.max(...store.appointments.map(a => a.id)) + 1 : 1;
    const newAppt = {
      id, pet_id: Number(pet_id), owner_id: Number(owner_id), service_type,
      appointment_date, appointment_time, veterinarian,
      status: status || 'Scheduled', reason_notes: reason_notes || '', cost: Number(cost || 0),
      created_at: new Date().toISOString()
    };
    store.appointments.push(newAppt);
    fs.writeFileSync(JSON_STORE_PATH, JSON.stringify(store, null, 2));
    return newAppt;
  },

  updateAppointmentStatus: (id, status) => {
    if (useNativeSqlite) {
      const stmt = db.prepare('UPDATE appointments SET status = ? WHERE id = ?');
      stmt.run(status, id);
      const getStmt = db.prepare('SELECT * FROM appointments WHERE id = ?');
      return getStmt.get(id);
    }
    const store = JSON.parse(fs.readFileSync(JSON_STORE_PATH, 'utf8'));
    const appt = store.appointments.find(a => a.id === Number(id));
    if (appt) {
      appt.status = status;
      fs.writeFileSync(JSON_STORE_PATH, JSON.stringify(store, null, 2));
    }
    return appt;
  },

  deleteAppointment: (id) => {
    if (useNativeSqlite) {
      const stmt = db.prepare('DELETE FROM appointments WHERE id = ?');
      const res = stmt.run(id);
      return res.changes > 0;
    }
    const store = JSON.parse(fs.readFileSync(JSON_STORE_PATH, 'utf8'));
    const initialLen = store.appointments.length;
    store.appointments = store.appointments.filter(a => a.id !== Number(id));
    fs.writeFileSync(JSON_STORE_PATH, JSON.stringify(store, null, 2));
    return store.appointments.length < initialLen;
  },

  // Vaccination Records
  addVaccination: (pet_id, vaccine_name, administered_date, next_due_date, veterinarian, status = 'Administered') => {
    if (useNativeSqlite) {
      const stmt = db.prepare(`
        INSERT INTO vaccinations (pet_id, vaccine_name, administered_date, next_due_date, veterinarian, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const res = stmt.run(pet_id, vaccine_name, administered_date, next_due_date, veterinarian, status);
      const getStmt = db.prepare('SELECT * FROM vaccinations WHERE id = ?');
      return getStmt.get(res.lastInsertRowid);
    }
    const store = JSON.parse(fs.readFileSync(JSON_STORE_PATH, 'utf8'));
    if (!store.vaccinations) store.vaccinations = [];
    const id = store.vaccinations.length > 0 ? Math.max(...store.vaccinations.map(v => v.id)) + 1 : 1;
    const newVax = { id, pet_id: Number(pet_id), vaccine_name, administered_date, next_due_date, veterinarian, status };
    store.vaccinations.push(newVax);
    fs.writeFileSync(JSON_STORE_PATH, JSON.stringify(store, null, 2));
    return newVax;
  },

  // Dashboard Stats
  getDashboardStats: (ownerId = null) => {
    const pets = dbHelper.getPets(ownerId);
    const appointments = dbHelper.getAppointments({ owner_id: ownerId });

    const totalPets = pets.length;
    const totalAppointments = appointments.length;
    const scheduledAppointments = appointments.filter(a => a.status === 'Scheduled').length;
    const completedAppointments = appointments.filter(a => a.status === 'Completed').length;
    const overdueVaccinations = pets.filter(p => p.vaccination_status === 'Overdue' || p.vaccination_status === 'Due Soon').length;

    // Upcoming list (up to 5)
    const upcoming = appointments
      .filter(a => a.status === 'Scheduled')
      .slice(0, 5);

    return {
      totalPets,
      totalAppointments,
      scheduledAppointments,
      completedAppointments,
      overdueVaccinations,
      upcoming
    };
  }
};

initSchema();

module.exports = {
  db,
  dbHelper,
  initSchema
};
