const express = require('express');
const { v4: uuidv4 } = require('uuid');

let { dataRole, dataUser } = require('./data2.js');

const app = express();
const port = 3000;

app.use(express.json());

// --- Hàm hỗ trợ
const findRoleById = (id) => dataRole.find(role => role.id === id);
const findUserByUsername = (username) => dataUser.find(user => user.username === username);


// ================= ROLES API =================

// Lấy tất cả roles
app.get('/roles', (req, res) => {
  res.json(dataRole);
});

// Lấy role theo ID
app.get('/roles/:id', (req, res) => {
  const role = findRoleById(req.params.id);

  if (!role) {
    return res.status(404).json({ message: 'Role not found' });
  }

  res.json(role);
});

// Tạo role
app.post('/roles', (req, res) => {

  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({
      message: 'Name and description are required'
    });
  }

  const newRole = {
    id: `r-${uuidv4()}`,
    name,
    description,
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  dataRole.push(newRole);

  res.status(201).json(newRole);
});


// Update role
app.put('/roles/:id', (req, res) => {

  const role = findRoleById(req.params.id);

  if (!role) {
    return res.status(404).json({
      message: 'Role not found'
    });
  }

  const { name, description } = req.body;

  if (name) role.name = name;
  if (description) role.description = description;

  role.updatedAt = new Date().toISOString();

  res.json(role);
});


// Delete role
app.delete('/roles/:id', (req, res) => {

  const index = dataRole.findIndex(r => r.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      message: 'Role not found'
    });
  }

  dataRole.splice(index, 1);

  res.status(204).send();
});



// ================= USERS API =================

// Lấy tất cả user
app.get('/users', (req, res) => {
  res.json(dataUser);
});


// Lấy user theo username
app.get('/users/:username', (req, res) => {

  const user = findUserByUsername(req.params.username);

  if (!user) {
    return res.status(404).json({
      message: 'User not found'
    });
  }

  res.json(user);
});


// Tạo user
app.post('/users', (req, res) => {

  const { username, password, email, fullName, roleId } = req.body;

  if (!username || !password || !email || !fullName || !roleId) {
    return res.status(400).json({
      message: 'Missing required fields'
    });
  }

  if (findUserByUsername(username)) {
    return res.status(409).json({
      message: 'Username already exists'
    });
  }

  const role = findRoleById(roleId);

  if (!role) {
    return res.status(404).json({
      message: 'Role not found'
    });
  }

  const newUser = {
    username,
    password,
    email,
    fullName,
    avatarUrl: "https://i.sstatic.net/l60Hf.png",
    status: true,
    loginCount: 0,
    role: { ...role },
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  dataUser.push(newUser);

  res.status(201).json(newUser);
});


// Update user
app.put('/users/:username', (req, res) => {

  const user = findUserByUsername(req.params.username);

  if (!user) {
    return res.status(404).json({
      message: 'User not found'
    });
  }

  const { fullName, email, status, roleId } = req.body;

  if (fullName) user.fullName = fullName;
  if (email) user.email = email;

  if (status !== undefined) {
    user.status = status;
  }

  if (roleId) {

    const role = findRoleById(roleId);

    if (!role) {
      return res.status(404).json({
        message: 'Role not found'
      });
    }

    user.role = { ...role };
  }

  user.updatedAt = new Date().toISOString();

  res.json(user);
});


// Delete user
app.delete('/users/:username', (req, res) => {

  const index = dataUser.findIndex(
    u => u.username === req.params.username
  );

  if (index === -1) {
    return res.status(404).json({
      message: 'User not found'
    });
  }

  dataUser.splice(index, 1);

  res.status(204).send();
});



// ============= SPECIAL API =============

// Lấy user theo role
app.get('/roles/:id/users', (req, res) => {

  const roleId = req.params.id;

  if (!findRoleById(roleId)) {
    return res.status(404).json({
      message: 'Role not found'
    });
  }

  const users = dataUser.filter(
    user => user.role.id === roleId
  );

  res.json(users);
});



// START SERVER
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});