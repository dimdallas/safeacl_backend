const express = require("express")
const app = express()
const cors = require("cors")

app.use(express.json())
app.use(cors())
// app.use((req, res, next) => {
//     console.log("my cors middleware")
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
//     res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,Authorization");

//     if(req.method === 'OPTIONS')
//         return res.status(200)
//     else{
//         next();
//     }
// });

//ROUTES//
//authentication & authorization routes

app.use("/auth", require("./routes/jwtAuth"))

//dashboard routes
app.use("/dashboard", require("./routes/dashboard"))

// userSequelize.authenticate()
//     .then(() => console.log('Database connected'))
//     .catch(error => console.error('Error' + error))

app.listen(5001, () => {
    console.log("server is running on port 5001")
})