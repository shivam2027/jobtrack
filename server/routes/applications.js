const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

const STATUSES = ['applied', 'interviewing', 'offer', 'rejected', 'withdrawn'];

// GET /api/applications  (supports ?status=&search=)
router.get('/', (req, res) => {
  const { status, search } = req.query;
  let query = 'SELECT * FROM applications WHERE user_id = ?';
  const params = [req.userId];

  if (status && STATUSES.includes(status)) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (search) {
    query += ' AND (company LIKE ? OR role LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  query += ' ORDER BY created_at DESC';

  const applications = db.prepare(query).all(...params);
  res.json({ applications });
});

// GET /api/applications/stats
router.get('/stats', (req, res) => {
  const rows = db
    .prepare('SELECT status, COUNT(*) as count FROM applications WHERE user_id = ? GROUP BY status')
    .all(req.userId);

  const stats = { applied: 0, interviewing: 0, offer: 0, rejected: 0, withdrawn: 0, total: 0 };
  rows.forEach((r) => {
    stats[r.status] = r.count;
    stats.total += r.count;
  });
  res.json({ stats });
});

// GET /api/applications/:id
router.get('/:id', (req, res) => {
  const app = db
    .prepare('SELECT * FROM applications WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.userId);
  if (!app) return res.status(404).json({ message: 'Application not found' });
  res.json({ application: app });
});

// POST /api/applications
router.post(
  '/',
  [
    body('company').trim().notEmpty().withMessage('Company is required'),
    body('role').trim().notEmpty().withMessage('Role is required'),
    body('status').optional().isIn(STATUSES).withMessage('Invalid status'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { company, role, status = 'applied', location, salary, job_url, notes, applied_date } =
      req.body;

    const result = db
      .prepare(
        `INSERT INTO applications
          (user_id, company, role, status, location, salary, job_url, notes, applied_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(req.userId, company, role, status, location, salary, job_url, notes, applied_date);

    const created = db.prepare('SELECT * FROM applications WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ application: created });
  }
);

// PUT /api/applications/:id
router.put('/:id', (req, res) => {
  const existing = db
    .prepare('SELECT * FROM applications WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.userId);
  if (!existing) return res.status(404).json({ message: 'Application not found' });

  const fields = ['company', 'role', 'status', 'location', 'salary', 'job_url', 'notes', 'applied_date'];
  const updates = {};
  fields.forEach((f) => {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  });

  if (updates.status && !STATUSES.includes(updates.status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const merged = { ...existing, ...updates };
  db.prepare(
    `UPDATE applications SET
      company = ?, role = ?, status = ?, location = ?, salary = ?, job_url = ?, notes = ?, applied_date = ?,
      updated_at = datetime('now')
     WHERE id = ? AND user_id = ?`
  ).run(
    merged.company,
    merged.role,
    merged.status,
    merged.location,
    merged.salary,
    merged.job_url,
    merged.notes,
    merged.applied_date,
    req.params.id,
    req.userId
  );

  const updated = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id);
  res.json({ application: updated });
});

// DELETE /api/applications/:id
router.delete('/:id', (req, res) => {
  const result = db
    .prepare('DELETE FROM applications WHERE id = ? AND user_id = ?')
    .run(req.params.id, req.userId);
  if (result.changes === 0) return res.status(404).json({ message: 'Application not found' });
  res.json({ message: 'Application deleted' });
});

module.exports = router;
