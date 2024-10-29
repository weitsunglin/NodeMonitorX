// controllers/UserController.js
const UserModel = require("../models/UserModel");

class UserController {
  static getAllUsers(req, res) {
    UserModel.getAllUsers((err, users) => {
      if (err) {
        return res.status(500).json({ error: "Failed to fetch users" });
      }
      res.json(users);
    });
  }

  static getUserById(req, res) {
    const userId = req.params.id;
    UserModel.getUserById(userId, (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Failed to fetch user" });
      }
      res.json(user);
    });
  }

  static createUser(req, res) {
    const userData = req.body;
    UserModel.createUser(userData, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to create user" });
      }
      res.json({ message: "User created successfully", userId: result.insertId });
    });
  }

  // 可以繼續添加更新和刪除等方法
}

module.exports = UserController;
