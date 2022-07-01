const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');


const app = express()
const port = process.env.PORT ||5000;

//middle wear use
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uwms3.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect()
        const userToDoCollection = client.db("taskManagement").collection("task");
        //post api
        
        app.get('/tasks',async(req,res)=>{
            const query={}
            const cursor = userToDoCollection.find(query)
            const result = await cursor.toArray()

          res.send(result)
        })

        app.post('/task', async (req,res)=>{
            const data = req.body;
            console.log(data)
            const result = await userToDoCollection.insertOne(data);
            res.send(result)
        })

        console.log('conect mongodb')
    }
    finally{

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
  res.send('Hello World!  ggg')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})





