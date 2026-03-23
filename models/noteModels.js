const { getSequelize } = require("../config/database");
const { initNoteSchema } = require("../schema/Note");

const sequelize = getSequelize();
const Note = initNoteSchema(sequelize);

async function createNote({ judul, isi }) {
  return Note.create({ judul, isi });
}

async function getAllNotes() {
  return Note.findAll({
    order: [["tanggal_dibuat", "DESC"], ["id", "DESC"]],
  });
}

async function getNoteById(id) {
  return Note.findByPk(id);
}

async function updateNote(id, { judul, isi }) {
  const [affected] = await Note.update({ judul, isi }, { where: { id } });
  if (!affected) return null;
  return getNoteById(id);
}

async function deleteNote(id) {
  const affected = await Note.destroy({ where: { id } });
  return affected > 0;
}

module.exports = {
  Note,
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
};

