const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();


app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/user');
const productRoutes = require('./routes/products');

app.use('/api/user', authRoutes);
app.use('/api/products', productRoutes);


app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
sequelize.authenticate()
  .then(() => {
    console.log('DB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('DB connection error:', err));
