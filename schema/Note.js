const { DataTypes } = require("sequelize");

function initNoteSchema(sequelize) {
  return sequelize.define(
    "Note",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      judul: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      isi: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      tanggal_dibuat: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "notes",
      timestamps: false,
    },
  );
}

module.exports = { initNoteSchema };
