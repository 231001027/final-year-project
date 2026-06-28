import { Router } from 'express';
import { pool } from '../db/pool.js';
import { mapTimestamps, omitPassword } from '../utils/helpers.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

const TEAM_UPDATE_FIELDS = [
  'student1_name',
  'student1_email',
  'student1_roll_no',
  'student1_department',
  'student1_year',
  'student1_semester',
  'student1_section',
  'student2_name',
  'student2_email',
  'student2_roll_no',
  'student2_department',
  'student2_year',
  'student2_semester',
  'student2_section',
  'selected_project_id',
  'selection_date',
] as const;

router.get('/', authenticate, authorize('faculty'), async (_req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM teams ORDER BY created_at ASC');
    res.json(result.rows.map((row) => mapTimestamps(omitPassword(row))));
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM teams WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }

    // Only allow teams to view their own data
    if (req.user?.role === 'team' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(mapTimestamps(omitPassword(result.rows[0])));
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', authenticate, authorize('faculty'), async (req, res, next) => {
  try {
    const updates = req.body as Record<string, unknown>;
    const setClauses: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    for (const field of TEAM_UPDATE_FIELDS) {
      if (field in updates) {
        setClauses.push(`${field} = $${paramIndex}`);
        values.push(updates[field]);
        paramIndex++;
      }
    }

    if (setClauses.length === 0) {
      res.status(400).json({ message: 'No valid fields to update' });
      return;
    }

    setClauses.push(`updated_at = NOW()`);
    values.push(req.params.id);

    const result = await pool.query(
      `UPDATE teams SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }

    res.json(mapTimestamps(omitPassword(result.rows[0])));
  } catch (err) {
    next(err);
  }
});

export default router;
