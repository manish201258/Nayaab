const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const dbConnect = require('./lib/dbConnect');

const adminRouter = require('./router/adminRoutes');
const userRouter = require('./router/userRoutes');

const app = express();
const PORT = 5000;

const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:3000'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Mount main routers
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);

(async () => {
  await dbConnect();
  console.log("Connected to DB");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  }); 
})();
