import sequelize from "./db.js";
import { DataTypes } from "sequelize";

import { encryptMessage, decryptMessage } from "./message.utils.js";

const Message = sequelize.define("Message", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    collate: "utf8mb4_general_cs",
  },
  senderId: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: "id",
    },
  },
});

Message.beforeCreate((message) => {
  message.content = encryptMessage(message.content);
});

Message.afterFind((message) => {
  if (message && message.content) {
    message.content = decryptMessage(message.content);
  }
});

export default Message;
