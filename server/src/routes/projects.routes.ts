import { Router } from 'express';
import { pool } from '../db/pool.js';
import { cleanProjectTitle, mapProjectRow, mapTimestamps } from '../utils/helpers.js';
import { cacheGet, cacheSet, cacheDelPattern } from '../db/cache.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, async (_req, res, next) => {
  try {
    const cacheKey = 'projects:all';
    const cached = await cacheGet(cacheKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const result = await pool.query(`
      SELECT * FROM projects
      ORDER BY id ASC
    `);
    const projects = result.rows.map((row) => mapProjectRow(row));

    await cacheSet(cacheKey, JSON.stringify(projects), 300); // Cache for 5 minutes

    res.json(projects);
  } catch (err) {
    next(err);
  }
});

router.get('/allocated-ids', async (_req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT project_id FROM allocations WHERE status = 'allocated'"
    );
    res.json(result.rows.map((row) => row.project_id));
  } catch (err) {
    next(err);
  }
});

router.get('/available', optionalAuth, async (_req, res, next) => {
  try {
    const cacheKey = 'projects:available';
    const cached = await cacheGet(cacheKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const result = await pool.query(`
      SELECT p.* FROM projects p
      WHERE p.id NOT IN (
        SELECT project_id FROM allocations WHERE status = 'allocated'
      )
      ORDER BY p.id ASC
    `);
    const projects = result.rows.map((row) => mapProjectRow(row));

    await cacheSet(cacheKey, JSON.stringify(projects), 60); // Cache for 1 minute (fresher data)

    res.json(projects);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    res.json(mapProjectRow(result.rows[0]));
  } catch (err) {
    next(err);
  }
});

router.post('/', authenticate, authorize('faculty'), async (req, res, next) => {
  try {
    const { title, domain, description, max_teams } = req.body;

    const result = await pool.query(
      `INSERT INTO projects (title, domain, description, faculty_guide, max_teams, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [cleanProjectTitle(title), domain, description, 'Not Assigned', max_teams ?? 1, req.user?.id]
    );

    res.status(201).json(mapProjectRow(result.rows[0]));
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authenticate, authorize('faculty'), async (req, res, next) => {
  try {
    const { title, domain, description } = req.body;

    const result = await pool.query(
      `UPDATE projects
       SET title = $1, domain = $2, description = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [cleanProjectTitle(title), domain, description, req.params.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    res.json(mapProjectRow(result.rows[0]));
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticate, authorize('faculty'), async (req, res, next) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const allocated = await client.query(
      "SELECT id FROM allocations WHERE project_id = $1 AND status = 'allocated' LIMIT 1",
      [req.params.id]
    );

    if (allocated.rows.length > 0) {
      await client.query('ROLLBACK');
      res.status(409).json({ message: 'Cannot delete a project that has been allocated to a team' });
      return;
    }

    await client.query('DELETE FROM allocations WHERE project_id = $1', [req.params.id]);
    const result = await client.query('DELETE FROM projects WHERE id = $1 RETURNING id', [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    await client.query('COMMIT');
    res.status(204).send();
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

export default router;
