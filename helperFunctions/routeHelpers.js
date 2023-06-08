const { readFileSync, writeFileSync, existsSync, readdirSync } = require('fs');
const {
  validateMob,
  validateMember,
} = require('../helperFunctions/validation');
const { join } = require('path');

const getMob = (path, id) => {
  const filePath = join(path, id + '.json');
  console.log(filePath);
  if (!existsSync(filePath)) {
    console.log('Mob does not exist.');
    throw new Error('Mob does not exist.');
  }
  const file = readFileSync(filePath);
  return JSON.parse(file.toString());
};

const getMobNames = path => {
  const files = readdirSync(path);
  const mobNames = [];
  files.forEach(file => {
    const data = getMob(path, file.replace('.json', ''));
    const { mobName, id } = data;
    mobNames.push({ mobName, id });
  });
  return mobNames;
};

const writeMob = (mob, id, path) => {
  writeFileSync(join(path, id + '.json'), JSON.stringify(mob, null, 2));
};

const getMember = (mob, id) => mob.members.find(member => member.id == id);

module.exports = { getMob, getMobNames, writeMob, getMember }