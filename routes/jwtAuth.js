const router = require("express").Router()
const pool = require("../databases/safeacltestDB")
const bcrypt = require("bcrypt")
const jwtGenerator = require("../utils/jwtGenerator")
//middleware for valid credentials
const validInfo = require("../middleware/validInfo")
//middleware for authorization
const authorization = require("../middleware/authorization")


router.post("/register", validInfo, async(req,res) => {
    try {
        //1. destructure req.body (name, email. password)
        const { username, email, password } = req.body

        //2. check if user exist (then error)
        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [
                email
            ]
        )

        if (user.rows.length !== 0){
            return res.status(401).send("User already exists")
        }
        
        //3. bcrypt password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds)

        const bcryptPassword = await bcrypt.hash(password, salt)
        
        //4. enter new user inside database
        const newUser = await pool.query(
            "INSERT INTO users (username, email, password) VALUES($1,$2,$3) RETURNING *",
            [
                username,
                email,
                bcryptPassword
            ]
        )

        //5. generate jwt
        const token = jwtGenerator(newUser.rows[0].user_id)
        res.json({token})

    } catch (error) {
        console.error(error.message)
        res.status(500).send("server error")
    }
})

router.options("/login", async(req,res) => {
    console.log("options login")
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.end();
})

router.post("/login", validInfo, async(req,res) => {
    try {
        // console.log("post login")
        //1. destructure req.body
        const {email, password} = req.body

        //2. check if user exists (then error)
        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [
                email
            ]
        )

        if(user.rows.length === 0){
            return res.status(401).json("User does not exist")
        }

        //3. check if incoming password == db password
        const validPassword = await bcrypt.compare(password, user.rows[0].password)
        
        if(!validPassword){
            return res.status(401).json("Password is incorrect")
        }

        //4. give them jtw
        const token = jwtGenerator(user.rows[0].user_id)
        // console.log(token)
        res.json({token})

    } catch (error) {
        console.error(error.message)
        res.status(500).send("server error")
    }
})

router.get("/is-verified", authorization, async(req, res) => {
    try {
        res.json(true)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("server error")
    }
})

module.exports = router