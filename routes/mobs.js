var express = require('express');
var router = express.Router();
const { join } = require('path');
const {
  getMob,
  getMobNames,
  writeMob,
  getMember,
} = require('../helperFunctions/routeHelpers');
const {
  validateMob,
  validateMember,
} = require('../helperFunctions/validation');
const dbPath = join(__dirname, '../db/mobs');

// Get all mobs
router.get('/', (_req, res) => {
  const data = getMobNames(dbPath);
  res.send(data);
});

// Get mob by id
router.get('/:mobId', (req, res, next) => {
  const { mobId } = req.params;
  try {
    const mob = getMob(dbPath, mobId);
    res.json(mob);
  } catch (error) {
    next(error);
  }
});

// Get all members of mob by id
router.get('/:mobId/members', (req, res) => {
  const { mobId } = req.params;
  const mob = getMob(dbPath, mobId);
  res.json(mob.members);
});

// Create new mob - name
router.post('/', (req, res) => {
  const { value, error } = validateMob(req.body);
  if (error) {
    throw new Error('Invalid mob name');
  }
  const id = req.id;
  const mob = { id, mobName: value.mobName, members: [] };
  writeMob(mob, id, dbPath);
  res.status(201).json({ id });
});

router.post('/:mobId/members', (req, res) => {
  const { value, error } = validateMember(req.body);
  if (error) {
    throw new Error(error.message)
  }
  const { mobId } = req.params;
  const memberId = req.id;
  const mob = getMob(dbPath, mobId);
  value.id = memberId;
  value.mobName = mob.mobName;
  mob.members.push(value);
  writeMob(mob, mobId, dbPath);
  res.status(201).json({ mobId, memberId });
});

router.get('/:mobId/members/:memberId', (req, res) => {
  const { mobId, memberId } = req.params;
  console.log(req.params);
  const mob = getMob(dbPath, mobId);
  const member = getMember(mob, memberId);
  if (!member) {
    throw new Error('Member does not exist.');
  }
  res.json(member);
});

module.exports = router;
