const express = require('express');
const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

const router = express.Router();

const users = [
  { uid: "1", name: "abdullah", gender: "male" },
  { uid: "2", name: "saeed", gender: "male" },
];

router.get('/', (req, res) => {
  res.json(users);
});

router.get('/:uid', (req, res) => {
  const userId = req.params.uid;
  const user = users.find(u => u.uid === userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

router.post('/', (req, res) => {
  const { uid, name, gender } = req.body;

  if (!uid || !name || !gender) {
    return res.status(400).json({ error: 'Please provide uid, name, and gender for user registration' });
  }

  if (users.some(user => user.uid === uid)) {
    return res.status(400).json({ error: 'User with this UID already exists' });
  }

  const newUser = { uid, name, gender };
  users.push(newUser);
  res.json(newUser);
});

// Use the user routes
app.use('/users', router);

app.listen(port, () => {
  console.log(`User listening on port ${port}`);
});
