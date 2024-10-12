import sequelize from "./db.js";
import { DataTypes } from "sequelize";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    collate: "utf8mb4_unicode_ci",
    unique: {
      msg: "username already in use",
    },
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: {
      msg: "This email is already in use.",
    },
    allowNull: false,
    validate: {
      isEmail: {
        msg: "Please enter a valid email address.",
      },
      notNull: {
        msg: "Email is required.",
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Password is required.",
      },
    },
  },
});

export default User;
