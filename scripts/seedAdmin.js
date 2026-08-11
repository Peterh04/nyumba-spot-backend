import sequelize from "../config/db.js";
import User from "../models/User.js";

const admin = {
  name: "admin",
  email: "admin123NyumbaSpot",
  email: "email@gmail.com",
  password: "admin",
  role: "admin",
};

try {
  await sequelize.authenticate();

  await User.create(admin);

  console.log("Succesfully seeded the admin");
} catch (error) {
  console.error(error);
}
