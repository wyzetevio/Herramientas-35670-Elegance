import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  registerUserDB,
  findUserByEmailDB,
  getUserByIdDB,
  getAllUsersDB,
  updateUserRoleDB,
  deleteUserDB,
  countAdminsDB,
} from "../models/user.model.js";

dotenv.config();

export const registerUser = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    const existingUser = await findUserByEmailDB(email);
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await registerUserDB(nombre, email, hashedPassword);

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmailDB(email);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await getUserByIdDB(id);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener perfil" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersDB();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener usuarios",
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    if (req.user.id === Number(req.params.id)) {
      return res.status(400).json({
        message: "No puedes cambiar tu propio rol",
      });
    }
    const { role } = req.body;

    if (role === "user") {
      const currentUser = await getUserByIdDB(req.params.id);

      if (currentUser.role === "admin") {
        const admins = await countAdminsDB();

        if (admins <= 1) {
          return res.status(400).json({
            message: "Debe existir al menos un administrador",
          });
        }
      }
    }

    const user = await updateUserRoleDB(req.params.id, role);

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al actualizar rol",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (req.user.id === Number(req.params.id)) {
      return res.status(400).json({
        message: "No puedes eliminar tu propia cuenta",
      });
    }

    const currentUser = await getUserByIdDB(req.params.id);

    if (currentUser.role === "admin") {
      const admins = await countAdminsDB();

      if (admins <= 1) {
        return res.status(400).json({
          message: "No se puede eliminar el último administrador",
        });
      }
    }

    await deleteUserDB(req.params.id);

    res.json({
      message: "Usuario eliminado",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al eliminar usuario",
    });
  }
};
