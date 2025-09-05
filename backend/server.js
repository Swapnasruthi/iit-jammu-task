const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const cors = require("cors");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors(
    {
        origin:"http://localhost:5173",
        methods: ['GET', 'POST','PUT', 'PATCH', 'DELETE'],
        credentials:true
    }
));


// app.options('/*', cors());
app.use(express.json());  //--> to read json data from the Db.

const authRouter = require('./routes/auth');
const cartRouter = require('./routes/cart');


app.use("/", authRouter);
app.use("/", cartRouter);




connectDB()
.then(
    () => {
        console.log("Database connected");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
)
.catch(
    (err) => {
        console.error("Database can't be connected"+ err.name);
    }
)


