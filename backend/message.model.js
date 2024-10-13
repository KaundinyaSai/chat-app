import sequelize from "./db.js";
import { DataTypes } from "sequelize";

import { encryptMessage, decryptMessage } from "./message.utils.js";

import User from "./user.model.js";

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
      model: User,
      key: "id",
    },
    onDelete: "CASCADE",
  },
});
Message.belongsTo(User, { foreignKey: "senderId" });

//hooks
Message.beforeCreate((message) => {
  message.content = encryptMessage(message.content);
});

Message.afterFind((result) => {
  // Check if result is array bcuz findAll returns array of messages
  if (Array.isArray(result)) {
    result.forEach((message) => {
      if (message.content) {
        message.content = decryptMessage(message.content);
      }
    });
  } else if (result && result.content) {
    result.content = decryptMessage(result.content);
  }
});

export default Message;
