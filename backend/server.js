const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors(
    {
        origin:"https://iit-jammu-task.vercel.app",
        methods: ['GET', 'POST','PUT', 'PATCH', 'DELETE'],
        credentials:true
    }
));


// app.options('/*', cors());
app.use(cookieParser());
app.use(express.json());  //--> to read json data from the Db.

const authRouter = require('./routes/auth');
const cartRouter = require('./routes/cart');
const orderRouter = require("./routes/order");


app.use("/", authRouter);
app.use("/", cartRouter);
app.use("/orders", orderRouter);




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


