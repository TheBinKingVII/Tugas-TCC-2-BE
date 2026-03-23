const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

dotenv.config();

let sequelize;

function env() {
  return {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "notes_db",
    ssl: String(process.env.DB_SSL || "false").toLowerCase() === "true",
  };
}

async function ensureDatabaseExists() {
  const { host, port, user, password, database, ssl } = env();
  const pool = mysql.createPool({
    host,
    port,
    user,
    password,
    ...(ssl ? { ssl: { rejectUnauthorized: false } } : {}),
    connectionLimit: 3,
  });

  try {
    await pool.query(
      `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
  } finally {
    await pool.end();
  }
}

function getSequelize() {
  if (sequelize) return sequelize;

  const { host, port, user, password, database, ssl } = env();
  sequelize = new Sequelize(database, user, password, {
    dialect: "mysql",
    host,
    port,
    logging: false,
    ...(ssl ? { dialectOptions: { ssl: { rejectUnauthorized: false } } } : {}),
  });
  return sequelize;
}

async function initDatabase() {
  await ensureDatabaseExists();
  const db = getSequelize();
  await db.authenticate();
  return db;
}

module.exports = { getSequelize, initDatabase };

