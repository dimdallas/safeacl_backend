const router = require("express").Router()
const safePool = require("../databases/safeacltestDB")
//middleware for authorization
const authorization = require("../middleware/authorization")

// const userSequelize = require("../databases/userSequelize")
// const User = require("../models/user")

router.get("/", authorization, async(req, res) => {
    try {
        // console.log(req.user)
        //req.user has the payload from authorization middleware
        // res.json(req.user.id)
        
        const doctor = await safePool.query(
            "SELECT * FROM doctors WHERE doctor_id = $1",
            [
                req.user.id
            ]
        )
        const response = '{"username": "'+doctor.rows[0].username+'","email": "'+doctor.rows[0].email+'"}'
        // console.log(response)
        res.json(JSON.parse(response))
        
    } catch (error) {
        console.error(error.message)
        res.status(500).send("server error")
    }
})

//get all patients
router.get("/patients", authorization, async(req, res) => {
    try{

        const myPatients = await safePool.query(
            "SELECT * FROM patients WHERE doctor_id = $1;",
            [
                req.user.id
            ]
        )

        res.json(myPatients.rows)
    } catch (err){
        console.log(err)
    }
})

//get patient
router.get("/patients/:param", authorization, async(req, res) => {
    try{
        const {param} = req.params
        console.log(param)

        const patient = await safePool.query(
            "SELECT * FROM patients WHERE (id_num,doctor_id) = ($1,$2)",
            [
                param,
                req.user.id
            ]
        )
        console.log(patient)
        if(patient.rows.length !== 0){
            return res.json(patient.rows)
        }

        const myPatients = await safePool.query(
            "SELECT * FROM patients WHERE doctor_id = $1;",
            [
                req.user.id
            ]
        )

        res.json(myPatients.rows[param-1])
    }catch(err){

    }
})


//create patient
router.post("/patients", authorization, async(req, res) => {
    try{
        //1. destructure req.body 
        const { name, surname, id_num, age, height, email, description } = req.body;
        
        //2. check if patient exist (then error)
        const patient = await safePool.query(
            "SELECT * FROM patients WHERE email = $1",
            [
                email
            ]
        )
        if (patient.rows.length !== 0){
            return res.status(401).send("Patient already exists")
        }
        
        //3. enter new patient into database
        const newPatient = await safePool.query(
            "INSERT INTO patients (name, surname, id_num, age, height, email, description, doctor_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
            [
                name,
                surname,
                id_num,
                age,
                height,
                email,
                description,
                req.user.id
            ]
        )

        res.json(newPatient.rows[0])
        // res.status(200).send("Patient created")
    } catch (err){
        console.log(err)
    }
})

//update patient
router.put("/patients/:param", authorization, async(req,res) => {
    try{
        const {param} = req.params
                
        const myPatients = await safePool.query(
            "SELECT * FROM patients WHERE doctor_id = $1;",
            [
                req.user.id
            ]
        )

        const { name, surname, id_num, age, height, email, description } = req.body;

        const updatePatient = await safePool.query(
            "UPDATE patients SET (name, surname, id_num, age, height, email, description) = ($1,$2,$3,$4,$5,$6,$7) WHERE patient_id = $8",
            [
                name,
                surname,
                id_num,
                age,
                height,
                email,
                description,
                myPatients.rows[param-1].patient_id
            ]
        )
        
        res.json("Succesful update")
    }catch(err){
        console.log(err)
    }
})

//delete patient
router.delete("/patients/:param", authorization, async(req, res) => {
    try{
        const {param} = req.params

        const myPatients = await safePool.query(
            "SELECT * FROM patients WHERE doctor_id = $1;",
            [
                req.user.id
            ]
        )
        const deletePatient = await safePool.query(
            "DELETE FROM patients WHERE patient_id = $1",
            [
                myPatients.rows[param-1].patient_id
            ]
        )

        res.json("Deleted successfully")
    }catch(err){
        console.log(err)
    }
})

module.exports = router