const { server } = require("../server");
const config = require("../config");
const mongoose = require("mongoose");

const User = require("../api/users/users.model");
const bcrypt = require("bcrypt");
const usersService = require("../api/users/users.service");
const jwt = require("jsonwebtoken");

// Créer un utilisateur admin s'il n'existe pas et affichage de son token
async function initializeAdminUser() {
  try {
    const existingUsers = await User.countDocuments();

    if (existingUsers === 0) {
      console.log(
        "Aucun utilisateur trouvé. Création de l'utilisateur admin..."
      );

      const adminPassword =
        config.adminInitialPassword || generateSecurePassword();
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const adminUser = await usersService.create({
        email: "admin@mail.com",
        password: hashedPassword,
        role: "admin",
      });

      const userId = adminUser._id;

      const token = jwt.sign({ userId }, config.secretJwtToken, {
        expiresIn: "3d",
      });

      console.log("Utilisateur admin créé avec succès");
      console.log("Email:", adminUser.email);
      console.log("Mot de passe :", adminPassword);
      console.log("Token:", token);
    }
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur admin:", error);
  }
}

mongoose.connect(config.mongoUri);

const db = mongoose.connection;

db.on("error", (err) => {
  console.log(err);
});

db.on("open", () => {
  console.log("Database connected");
});

initializeAdminUser();

server.listen(config.port, () => {
  console.log("app running");
});
