var express = require('express');
var router = express.Router();
const { join } = require('path');
const {
  getMob,
  getMobNames,
  writeMob,
  getMember,
} = require('../helperFunctions/routeHelpers');
const dbPath = join(__dirname, '../db/mobs');

router.get('/', (_req, res) => {
  const data = getMobNames(dbPath);
  res.send(data);
});

router.get('/:mobId', (req, res, next) => {
  const { mobId } = req.params;
  try {
    const mob = getMob(dbPath, mobId);
    res.json(mob);
  } catch (error) {
    next(error);
  }
});

router.get('/:mobId/members', (req, res) => {
  const { mobId } = req.params;
  const mob = getMob(dbPath, mobId);
  res.json(mob.members);
});

router.post('/', (req, res) => {
  const { mobName } = req.body;
  const id = req.id;
  const mob = { id, mobName, members: [] };
  writeMob(mob, id, dbPath);
  res.status(201).json({ id });
});

router.post('/:mobId/members', (req, res) => {
  const { mobId } = req.params;
  const memberId = req.id;
  const mob = getMob(dbPath, mobId);
  const newMember = req.body;
  newMember.id = memberId;
  newMember.mobName = mob.mobName;
  mob.members.push(newMember);
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
