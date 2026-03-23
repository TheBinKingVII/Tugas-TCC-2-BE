const noteModels = require("../models/noteModels");

function validString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function validId(v) {
  const id = Number(v);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function createNote(req, res) {
  try {
    const { judul, isi } = req.body || {};
    if (!validString(judul) || !validString(isi)) {
      return res.status(400).json({ message: "`judul` dan `isi` wajib diisi." });
    }

    const note = await noteModels.createNote({
      judul: judul.trim(),
      isi: isi.trim(),
    });
    return res.status(201).json(note);
  } catch (error) {
    console.error("createNote error:", error);
    return res
      .status(500)
      .json({ message: "Gagal menambah catatan.", detail: error.message });
  }
}

async function getNotes(req, res) {
  try {
    const notes = await noteModels.getAllNotes();
    return res.json(notes);
  } catch (error) {
    console.error("getNotes error:", error);
    return res.status(500).json({ message: "Gagal mengambil daftar catatan." });
  }
}

async function getNoteById(req, res) {
  try {
    const id = validId(req.params.id);
    if (!id) return res.status(400).json({ message: "ID tidak valid." });

    const note = await noteModels.getNoteById(id);
    if (!note) return res.status(404).json({ message: "Catatan tidak ditemukan." });
    return res.json(note);
  } catch (error) {
    console.error("getNoteById error:", error);
    return res.status(500).json({ message: "Gagal mengambil catatan." });
  }
}

async function updateNote(req, res) {
  try {
    const id = validId(req.params.id);
    if (!id) return res.status(400).json({ message: "ID tidak valid." });

    const { judul, isi } = req.body || {};
    if (!validString(judul) || !validString(isi)) {
      return res.status(400).json({ message: "`judul` dan `isi` wajib diisi." });
    }

    const note = await noteModels.updateNote(id, {
      judul: judul.trim(),
      isi: isi.trim(),
    });
    if (!note) return res.status(404).json({ message: "Catatan tidak ditemukan." });
    return res.json(note);
  } catch (error) {
    console.error("updateNote error:", error);
    return res.status(500).json({ message: "Gagal mengubah catatan." });
  }
}

async function deleteNote(req, res) {
  try {
    const id = validId(req.params.id);
    if (!id) return res.status(400).json({ message: "ID tidak valid." });

    const ok = await noteModels.deleteNote(id);
    if (!ok) return res.status(404).json({ message: "Catatan tidak ditemukan." });
    return res.json({ message: "Catatan berhasil dihapus." });
  } catch (error) {
    console.error("deleteNote error:", error);
    return res.status(500).json({ message: "Gagal menghapus catatan." });
  }
}

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};

