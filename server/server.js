const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const pool = require('./db');
const PORT = process.env.PORT || 5000;
const app = express();
const cors = require('cors');

dotenv.config();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cors());


app.get('/users', async (req, res) => {
    const item = await pool.query(`select * from users`);
    res.send(item.rows);
});

app.post('/register', async (req, res) => {
    const success = await pool.query(`insert into users(name, email, password) values('${req.body.name}', '${req.body.email}', '${req.body.password}');`);
    res.send(success);
});

app.post('/login', async (req, res) => {
    const loginUser = await pool.query(`select id, name, email, isAdmin from users where email ='${req.body.email}' and password ='${req.body.password}';`);
    if (loginUser) {
        res.send({
            id: loginUser.rows[0].id,
            name: loginUser.rows[0].name,
            email: loginUser.rows[0].email,
            isadmin: loginUser.rows[0].isadmin
        });
    }
    else {
        res.status(401).send({msg: 'Invalid Email or Password'});
    }
});

app.post('/addExcercise', async (req, res) => {
    const success = await pool.query(`insert into excercises
        (userid, 
        week_day, 
        excercise,
        sets,
        reps) 
        values
        ('${req.body.userid}', 
        '${req.body.week_day}', 
        '${req.body.excercise}',
        '${req.body.sets}',
        '${req.body.reps}');`);
    res.send(success);
});

app.get('/:id/:day/excerciseList', async (req, res) => {
    const excerciseList = await pool.query(`select * from excercises where userid = ${req.params.id} and week_day = '${req.params.day}';`);
    if (excerciseList.rows) {
        res.send(excerciseList.rows);
    }
    else {
        res.send(false);
    }
});


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});