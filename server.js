const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./index');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', routes);

const PORT = process.env.PORT || 4242;
app.get('/', (req, res) => {
  res.send('👋 Welcome to the Stripe POS Backend is Live!');
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
