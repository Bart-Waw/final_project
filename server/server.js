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


app.get('/users/:id', async (req, res) => {
    const item = await pool.query(`select name, email, goal from users where id = '${req.params.id}'`);
    res.send(item.rows);
});

app.post('/users/:id/changeGoal', async (req, res) => {
    const success = await pool.query(`update users set goal = '${req.body.goal}' where id = '${req.params.id}';`);
    res.send(success);
});

app.post('/register', async (req, res) => {
    try {
        const success = await pool.query(`insert into users(name, email, password) values('${req.body.name}', '${req.body.email}', '${req.body.password}');`);
        if (success) {
            loginUser = await pool.query(`select id, name, email, isAdmin, goal from users where email ='${req.body.email}' and password ='${req.body.password}';`);
            res.send({
                id: loginUser.rows[0].id,
                name: loginUser.rows[0].name,
                email: loginUser.rows[0].email,
                isadmin: loginUser.rows[0].isadmin,
                goal: loginUser.rows[0].goal
            });
        }
    }
    catch (error) {
        res.status(401).send({msg: 'user is already registered'});
    }
});

app.post('/login', async (req, res) => {
    const loginUser = await pool.query(`select id, name, email, isAdmin, goal from users where email ='${req.body.email}' and password ='${req.body.password}';`);
    if (loginUser.rows[0]) {
        res.send({
            id: loginUser.rows[0].id,
            name: loginUser.rows[0].name,
            email: loginUser.rows[0].email,
            isadmin: loginUser.rows[0].isadmin,
            goal: loginUser.rows[0].goal
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
        reps,
        weight,
        week_number) 
        values
        ('${req.body.userid}', 
        '${req.body.week_day}', 
        '${req.body.excercise}',
        '${req.body.sets}',
        '${req.body.reps}',
        '${req.body.weights}',
        '${req.body.week_number}');`);
    res.send(success);
});

app.post('/deleteExcercise', async (req, res) => {
    const success = await pool.query(`delete from excercises where id = ${req.body.id};`);
    res.send(success);
});

app.post('/completeExcercise', async (req, res) => {
    const success = await pool.query(`update excercises set completed = true where id = '${req.body.excerciseid}';`)
    res.send(success);
});


app.get('/:id/:day/:week/excerciseList', async (req, res) => {
    const excerciseList = await pool.query(`select * from excercises where userid = ${req.params.id} and week_day = '${req.params.day}' and week_number = ${req.params.week};`);
    if (excerciseList.rows) {
        res.send(excerciseList.rows);
    }
    else {
        res.send(false);
    }
});

app.get('/:id/:week/completedExcerciseList', async (req, res) => {
    const excerciseList = await pool.query(`select * from excercises where userid = ${req.params.id} and week_number = ${req.params.week} order by week_day;`);
    if (excerciseList.rows) {
        excerciseList.rows.forEach(item => {
            if (item.week_day === "Monday") {
                item.week_day = 1;
            }
            if (item.week_day === "Tuesday") {
                item.week_day = 2;
            }
            if (item.week_day === "Wednesday") {
                item.week_day = 3;
            }
            if (item.week_day === "Thursday") {
                item.week_day = 4;
            }
            if (item.week_day === "Friday") {
                item.week_day = 5;
            }
            if (item.week_day === "Saturday") {
                item.week_day = 6;
            }
            if (item.week_day === "Sunday") {
                item.week_day = 7;
            }
        })
        excerciseList.rows.sort((a, b) => (a.week_day > b.week_day) ? 1 : -1);
        excerciseList.rows.forEach(item => {
            if (item.week_day === 1) {
                item.week_day = "Monday";
            }
            if (item.week_day === 2) {
                item.week_day = "Tuesday";
            }
            if (item.week_day === 3) {
                item.week_day = "Wednesday";
            }
            if (item.week_day === 4) {
                item.week_day = "Thursday";
            }
            if (item.week_day === 5) {
                item.week_day = "Friday";
            }
            if (item.week_day === 6) {
                item.week_day = "Saturday";
            }
            if (item.week_day === 7) {
                item.week_day = "Sunday";
            }
        })
        res.send(excerciseList.rows);
    }
    else {
        res.send(false);
    }
});


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});