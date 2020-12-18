/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import * as cors from 'cors';
import { Pool} from 'pg'

const app = express();

app.use(express.json())
app.use(cors())

const pool = new Pool({
    "user": "postgres",
    "password" : "postgres",
    "host" : "localhost",
    "port" : 5432,
    "database" : "todo"
})

 
app.get("/", (req, res) => res.sendFile(`${__dirname}/index.html`))

app.get("/todos", async (req, res) => {
    const rows = await readTodos();
    res.setHeader("content-type", "application/json")    
    res.send(JSON.stringify(rows))
})

app.post("/todos", async (req, res) => {
  const result = {}
  try{
      const reqJson = req.body;
      result.success = await addTodo(reqJson.text)
  }
  catch(e){
      result.success = false;
  }
  finally{
      res.setHeader("content-type", "application/json")
      res.send(JSON.stringify(result))
  }
})

app.get("/todos/check", (req, res)=>{
    res.sendStatus(200)
})


app.listen(8080, () => console.log("Web server is listening.. on port 8080"))

start()

async function start() {
    await connect();
}

async function connect() {
    try {
        await pool.connect(); 
    }
    catch(e) {
        console.error(`Failed to connect ${e}`)
    }
}

async function readTodos() {
    try {
    const results = await pool.query("select id, text from todos");
    return results.rows;
    }
    catch(e){
        return [];
    }
}

async function addTodo(todoText){
    try{
        await pool.query(" insert into todos (text) values ($1)", [todoText])
    }
    catch(e){
        return [];
    }
}


