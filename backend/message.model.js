import sequelize from "./db.js";
import { DataTypes } from "sequelize";

const Message = sequelize.define("Message", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.TEXT,
    collate: "utf8mb4_unicode_ci",
    allowNull: false,
  },
  senderId: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: "id",
    },
  },
});

export default Message;
