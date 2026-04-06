const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/finance', require('./routes/finance'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/timeblocks', require('./routes/timeblocks'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DayFlow API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});