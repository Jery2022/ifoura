const admin = require("../config/firebase");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Créer l'utilisateur dans Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // Créer l'utilisateur dans notre base de données
    const user = await User.create({
      firebaseUid: userRecord.uid,
      email,
      password, // Le hook beforeCreate de Sequelize hash le mot de passe
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "User registration failed" });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user && (await user.comparePassword(password))) {
      // Générer un token Firebase pour l'authentification côté client
      const firebaseToken = await admin
        .auth()
        .createCustomToken(user.firebaseUid);

      res.json({
        id: user.id,
        email: user.email,
        role: user.role,
        token: generateToken(user.id), // Notre JWT pour l'API backend
        firebaseToken, // Token Firebase pour l'authentification client
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser };
