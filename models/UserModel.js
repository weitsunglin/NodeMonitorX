// models/UserModel.js
const db = require("./db");

class UserModel {
  // 獲取所有使用者
  static getAllUsers(callback) {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching users:", err);
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  }

  // 根據ID獲取使用者
  static getUserById(id, callback) {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error("Error fetching user by ID:", err);
        callback(err, null);
        return;
      }
      callback(null, results[0]);
    });
  }

  // 新增使用者
  static createUser(userData, callback) {
    const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
    db.query(sql, [userData.name, userData.email], (err, results) => {
      if (err) {
        console.error("Error creating user:", err);
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  }

  // 更新使用者
  static updateUser(id, userData, callback) {
    const sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
    db.query(sql, [userData.name, userData.email, id], (err, results) => {
      if (err) {
        console.error("Error updating user:", err);
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  }

  // 刪除使用者
  static deleteUser(id, callback) {
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error("Error deleting user:", err);
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  }
}

module.exports = UserModel;
