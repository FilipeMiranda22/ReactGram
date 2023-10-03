const User = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

//Generate User Token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};

//Register user and sign in
const register = async (req, res) => {
  const { name, email, password } = req.body;

  //Check if user exists
  const user = await User.findOne({ email });

  if (user) {
    res.status(422).json({ errors: ["Este e-mail já foi cadastrado!"] });
    return;
  }

  //Generate password hash
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  //Create User
  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  });

  //If user was created successfully, return token
  if (!newUser) {
    res
      .status(422)
      .json({ errors: ["Houve um erro, tente novamente mais tarde!"] });
    return;
  }

  res.status(201).json({
    _id: newUser._id,
    token: generateToken(newUser._id),
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({ errors: ["Usuário não encontrado."] });
    return;
  }

  //Check if password matches
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({ errors: ["Senha inválida"] });
    return;
  }

  res.status(201).json({
    _id: user._id,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};

//Get current logged in user
const getCurrentUser = async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
};

const update = async (req, res) => {
  const { name, password, bio } = req.body;

  let profileImage = null;
  if (req.file) {
    profileImage = req.file.filename;
  }

  const reqUser = req.user;
  const user = await User.findById(
    new mongoose.Types.ObjectId(reqUser._id)
  ).select("-password");

  if (name) {
    user.name = name;
  }

  if (password) {
    //Generate password hash
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    user.password = passwordHash;
  }

  if (profileImage) {
    user.profileImage = profileImage;
  }

  if (bio) {
    user.bio = bio;
  }

  await user.save();

  res.status(200).json(user);
};

//Get user by Id
const getUserByID = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(new mongoose.Types.ObjectId(id)).select(
      "-password"
    );
    if (!user) {
      res.status(404).json({ errors: ["Usuário não encontrado"] });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ errors: ["Id Inválido"] });
    return;
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  update,
  getUserByID,
};
