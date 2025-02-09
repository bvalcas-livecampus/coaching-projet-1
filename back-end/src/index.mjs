import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.mjs';
import errorHandler from './middleware/error.mjs';
dotenv.config();
const app = express();



const port = process.env.PORT || 3001;
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.use("/", authRoutes);



app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


