const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();
const prisma = new PrismaClient();

// GET all departments (any logged in user)
router.get('/', auth, async (req, res) => {
  try {
    const departments = await prisma.department.findMany();
    res.json({ departments });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// POST create department (ADMIN only)
router.post('/', auth, roleCheck(['ADMIN']), async (req, res) => {
  const { name, description } = req.body;
  try {
    const department = await prisma.department.create({
      data: { name, description }
    });
    res.status(201).json({ department });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;