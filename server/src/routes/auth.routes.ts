import { Router } from 'express';
import { pool } from '../db/pool.js';
import { mapTimestamps, omitPassword } from '../utils/helpers.js';

const router = Router();

router.post('/team/login', async (req, res, next) => {
  try {
    const { team_id, password } = req.body;

    if (!team_id || !password) {
      res.status(400).json({ message: 'Team ID and password are required' });
      return;
    }

    const result = await pool.query(
      'SELECT * FROM teams WHERE team_id = $1 AND (password_hash = $2 OR student1_roll_no = $2 OR student2_roll_no = $2)',
      [team_id, password]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ message: 'Invalid Team ID or Password' });
      return;
    }

    res.json(mapTimestamps(omitPassword(result.rows[0])));
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
      'SELECT * FROM faculty WHERE faculty_id = $1 AND password_hash = $2',
      [faculty_id, password]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ message: 'Invalid Faculty ID or Password' });
      return;
    }

    res.json(mapTimestamps(omitPassword(result.rows[0])));
  } catch (err) {
    next(err);
  }
});

export default router;
