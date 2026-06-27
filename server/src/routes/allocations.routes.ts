import { Router } from 'express';
import { pool } from '../db/pool.js';
import { mapProjectRow, mapTimestamps, omitPassword } from '../utils/helpers.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const status = req.query.status as string | undefined;
    let query = 'SELECT * FROM allocations';
    const params: string[] = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }

    query += ' ORDER BY allocation_date DESC';

    const result = await pool.query(query, params);
    res.json(result.rows.map((row) => mapTimestamps(row)));
  } catch (err) {
    next(err);
  }
});

router.get('/details', async (req, res, next) => {
  try {
    const status = (req.query.status as string) || 'allocated';

    const result = await pool.query(
      `SELECT
         a.*,
         row_to_json(t.*) AS team,
         row_to_json(p.*) AS project
       FROM allocations a
       JOIN teams t ON t.id = a.team_id
       JOIN projects p ON p.id = a.project_id
       WHERE a.status = $1
       ORDER BY a.allocation_date DESC`,
      [status]
    );

    const data = result.rows.map((row) => ({
      ...mapTimestamps({
        id: row.id,
        project_id: row.project_id,
        team_id: row.team_id,
        faculty_id: row.faculty_id,
        allocation_date: row.allocation_date,
        status: row.status,
      }),
      team: mapTimestamps(omitPassword(row.team)),
      project: mapProjectRow(row.project),
    }));

    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const client = await pool.connect();

  try {
    const { project_id, team_id, faculty_id } = req.body;

    if (!project_id || !team_id) {
      res.status(400).json({ message: 'project_id and team_id are required' });
      return;
    }

    await client.query('BEGIN');

    const teamResult = await client.query('SELECT * FROM teams WHERE id = $1 FOR UPDATE', [team_id]);

    if (teamResult.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(404).json({ message: 'Team not found' });
      return;
    }

    if (teamResult.rows[0].selected_project_id) {
      await client.query('ROLLBACK');
      res.status(409).json({ message: 'Team has already selected a project' });
      return;
    }

    const projectAllocated = await client.query(
      "SELECT id FROM allocations WHERE project_id = $1 AND status = 'allocated' LIMIT 1",
      [project_id]
    );

    if (projectAllocated.rows.length > 0) {
      await client.query('ROLLBACK');
      res.status(409).json({ message: 'Project is no longer available' });
      return;
    }

    const allocationResult = await client.query(
      `INSERT INTO allocations (project_id, team_id, faculty_id, status)
       VALUES ($1, $2, $3, 'allocated')
       RETURNING *`,
      [project_id, team_id, faculty_id || null]
    );

    await client.query(
      `UPDATE teams
       SET selected_project_id = $1, selection_date = NOW(), updated_at = NOW()
       WHERE id = $2`,
      [project_id, team_id]
    );

    await client.query('COMMIT');
    res.status(201).json(mapTimestamps(allocationResult.rows[0]));
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

export default router;
