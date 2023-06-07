var express = require('express');
var router = express.Router();
const { join } = require('path');
const {
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
  writeFile,
} = require('fs');

const dbPath = join(__dirname, '../db/mobs');

const getMobNames = path => {
  const files = readdirSync(path);
  const mobNames = [];
  files.forEach(file => {
    const fileContent = readFileSync(join(path, file));
    const data = JSON.parse(fileContent.toString());
    const { mobName, id } = data;
    mobNames.push({ mobName, id });
  });
  return mobNames;
};

const getMob = (id, path) => {
  const file = readFileSync(join(path, id + '.json'));
  return JSON.parse(file.toString());
};

const writeMob = (mob, id, path) => {
  writeFileSync(join(path, id + '.json'), JSON.stringify(mob, null, 2));
};

const getMember = (mob, id) => mob.members.find(member => member.id == id);

router.get('/', (_req, res) => {
  const data = getMobNames(dbPath);
  res.send(data);
});

router.get('/:mobId', (req, res) => {
  const { mobId } = req.params;
  const mob = getMob(mobId, dbPath);
  res.json(mob);
});

router.get('/:mobId/members', (req, res) => {
  const { mobId } = req.params;
  const mob = getMob(mobId, dbPath);
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
  const mob = getMob(mobId, dbPath);
  const newMember = req.body;
  newMember.id = memberId;
  newMember.mobName = mob.mobName;
  mob.members.push(newMember);
  writeMob(mob, mobId, dbPath);
  res.status(201).json({ mobId, memberId });
});

router.get('/:mobId/members/:memberId', (req, res) => {
  const { mobId, memberId } = req.params;
  console.log(req.params)
  const mob = getMob(mobId, dbPath);
  const member = getMember(mob, memberId);
  res.json(member);
});

module.exports = router;
