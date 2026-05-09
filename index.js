const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { initDatabase } = require("./config/database");
const noteRoutes = require("./routes/noteRoutes");
const { Note } = require("./models/noteModels");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "https://note-fe-059-dot-b-03-489013.uc.r.appspot.com",
      "http://localhost:8080",
      "http://localhost:3000",
    ],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

async function startServer() {
  try {
    const sequelize = await initDatabase();

    // Buat tabel notes otomatis jika belum ada
    await Note.sync();

    // Frontend (HTML/CSS/JS tanpa framework)
    app.use(express.static(path.join(__dirname, "..", "FE")));
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "..", "FE", "index.html"));
    });

    // API health check
    app.get("/api/health", (req, res) => {
      res.json({ message: "OK", service: "notes-api" });
    });

    app.use("/api/notes", noteRoutes);

    app.use("/api", (req, res) => {
      res.status(404).json({ message: "Endpoint API tidak ditemukan." });
    });

    // Fallback untuk route frontend
    app.use((req, res) => {
      res.sendFile(path.join(__dirname, "..", "FE", "index.html"));
    });

    const port = Number(process.env.PORT || 3000);
    app.listen(port, () => {
      console.log(`Server jalan di http://localhost:${port}`);
      console.log(`Database "${sequelize.config.database}" siap dipakai.`);
    });
  } catch (error) {
    console.error("Gagal menjalankan server:", error.message || error);
    process.exit(1);
  }
}

startServer();
