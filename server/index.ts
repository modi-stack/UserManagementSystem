import express from 'express';
const app = express();
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import pools from "./db";
import authorize from './middleware_authorization';
import config from './config';

app.use(cors());
app.use(express.json());

app.listen(5000, () => {
    console.log("Server 5000");    
});

//2.f(request a token)
app.get('/generateToken', (req:any, res:any) => {
    const data = { name: "Priya", scope: ["customer:create"]};
    const token =jwt.sign(data, config.JWT_SECRET_KEY);
    res.send(token);
})

//2.a(get all users)
app.get("/users", authorize(), async (req:any, res:any) => {
    try {
        const allUsers = await pools.query("select get_users()");
        res.json(allUsers.rows[0].get_users);
    } catch (err:any) {
        console.error(err.message);
    }
});

//2.b(create)
app.post("/users/create", authorize(), async (req:any, res:any) => {
    try {
      const { name, email_id, password } = req.body;
      let data = {"name": name, "email_id": email_id, "password": password}
      const newUsers = await pools.query("select insert_data($1::json)",[data]);
      res.status(newUsers.rows[0].insert_data.status).send(newUsers.rows[0].insert_data.message);
    } catch (err:any) {
      res.json(err.message);
    }
});

//2.c(update a user)
app.put("/users/update", authorize(), async (req:any, res:any) => {
    try {
        const { id, name, email_id } = req.body;
        var json_data = {"id": id, "name": name, "email": email_id}
        const updateUser = await pools.query("select update_user($1)",[json_data]);
        // res.json(updateUser.rows[0].update_user.status);
        res.status(updateUser.rows[0].update_user.status).send(updateUser.rows[0].update_user.message);
    } catch (err:any) {
        console.error(err.message);
    }
});

//2.d(delete a user)
app.delete("/users/delete", authorize(), async (req:any, res:any) => {
    try {
        const { email_id } = req.body;
        const deleteUser = await pools.query("select delete_user($1)",[email_id]);
        res.json(deleteUser.rows[0].delete_user);
    } catch (err:any) {
        console.log(err.message);
    }
});
  
//2.e(get a user)
app.get("/users/:id", authorize(), async (req:any, res:any) => {
    try {
        const { id } = req.params;
        const User = await pools.query("select get_user($1)", [id]);
        res.json(User.rows[0].get_user);
    } catch (err:any) {
        console.error(err.message);
        }
});

app.put("/users/update_password", authorize(), async (req:any, res:any) => {
    try {
        const { id, new_password } = req.body;
        var json_data = {"id": id, "password": new_password}
        const updateUserPassword = await pools.query("select update_user_password($1)",[json_data]);
        // res.json(updateUser.rows[0].update_user.status);
        res.status(updateUserPassword.rows[0].update_user_password.status).send(updateUserPassword.rows[0].update_user_password.message);
    } catch (err:any) {
        console.error(err.message);
    }
});