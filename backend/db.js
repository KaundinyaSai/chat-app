import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
    logging: false,
  }
);

//check connection
try {
  await sequelize.authenticate();
  console.log("Connection to database has been established successfully.");
} catch (error) {
  console.log("Failed to connect to database: ", error);
}

export default sequelize;
