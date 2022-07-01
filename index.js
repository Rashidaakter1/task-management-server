const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express()
const port = process.env.PORT || 5000;

//middle wear use
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uwms3.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect()
    const userToDoCollection = client.db("taskManagement").collection("task");
    const userCompletedCollection = client.db("completeTask").collection("doneTask");
    //post api

    //get all the tasks
    app.get('/tasks', async (req, res) => {
      const query = {}
      const cursor = userToDoCollection.find(query)
      const result = await cursor.toArray()

      res.send(result)
    })

    // get one task
    app.get('/tasks/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await userToDoCollection.findOne(query)
      res.send(result)
    })

    //post tasks

    app.post('/tasks', async (req, res) => {
      const data = req.body;
      console.log(data)
      const result = await userToDoCollection.insertOne(data);
      res.send(result)
    })

    //put method in task
    app.patch('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      
      const filter = { _id: ObjectId(id)};
      const modifiedData = req.body;
      console.log(id,modifiedData)
      const options = { upsert: true };

      const updateDoc = {
        $set: modifiedData
      };
      const result = await userToDoCollection.updateOne(filter, updateDoc, options);

      res.send(result)
    })

    //delete method on tasks
    app.delete('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await userToDoCollection.deleteOne(filter);
      res.send(result)
    })

    //post method on completed task
    app.post('/completedTask',async(req,res)=>{
      const data = req.body;
      console.log(data)
      const result = await userCompletedCollection.insertOne(data);
      res.send(result)
    })

    // get method on completed task
    app.get('/completedTask', async (req, res) => {
      const query = {}
      const cursor = userCompletedCollection.find(query)
      const result = await cursor.toArray()

      res.send(result)
    })


    console.log('conect mongodb')
  }
  finally {

  }
}
run().catch(console.dir)


app.get('/', (req, res) => {
  res.send('Hello World!  ggg')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})





