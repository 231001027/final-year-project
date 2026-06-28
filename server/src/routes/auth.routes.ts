import { Router } from 'express';
import { pool } from '../db/pool.js';
import { mapTimestamps, omitPassword } from '../utils/helpers.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';

const router = Router();

router.post('/team/login', async (req, res, next) => {
  try {
    const { team_id, password } = req.body;

    if (!team_id || !password) {
      res.status(400).json({ message: 'Team ID and password are required' });
      return;
    }

    const result = await pool.query(
      'SELECT * FROM teams WHERE team_id = $1',
      [team_id]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ message: 'Invalid Team ID or Password' });
      return;
    }

    const team = result.rows[0];
    
    // Check password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, team.password_hash);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid Team ID or Password' });
      return;
    }

    // Generate JWT token
    const token = generateToken({
      id: team.id,
      role: 'team',
      team_id: team.team_id,
    });

    res.json({
      ...mapTimestamps(omitPassword(team)),
      token,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/faculty/login', async (req, res, next) => {
  try {
    const { faculty_id, password } = req.body;

    if (!faculty_id || !password) {
      res.status(400).json({ message: 'Faculty ID and password are required' });
      return;
    }

    const result = await pool.query(
      'SELECT * FROM faculty WHERE faculty_id = $1',
      [faculty_id]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ message: 'Invalid Faculty ID or Password' });
      return;
    }

    const faculty = result.rows[0];
    
    // Check password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, faculty.password_hash);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid Faculty ID or Password' });
      return;
    }

    // Generate JWT token
    const token = generateToken({
      id: faculty.id,
      role: 'faculty',
      faculty_id: faculty.faculty_id,
    });

    res.json({
      ...mapTimestamps(omitPassword(faculty)),
      token,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
