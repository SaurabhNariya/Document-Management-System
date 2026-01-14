import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import configPkg from '../config/config.js';
const config = configPkg.default || configPkg;

dotenv.config();

// 🔹 ESM replacements
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

const env = process.env.NODE_ENV || 'production';
const settings = config[env];

const db = {};

const sequelize = new Sequelize(settings.url, settings);

// 🔹 Load all models manually (no sequelize.import in ESM)
for (const file of fs.readdirSync(__dirname)) {
  if (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.endsWith('.js')
  ) {
    const modelModule = await import(path.join(__dirname, file));
    const model = modelModule.default(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }
}

// 🔹 Associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
