const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');



app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dbdl3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run () {
    try{
        await client.connect()
        const database = client.db('car_shop')
        const ordersCollection = database.collection('orders')
        const usersCollection = database.collection('users')
        const servicesCollection = database.collection('services')

        app.get('/services',async(req, res) => {
          const services = servicesCollection.find({});
          const product = await services.toArray()
          res.send(product)
        })

        app.get('/orders', async(req, res) => {
          const email = req.query.email;
          const query = {email: email}
          const cursor = ordersCollection.find(query);
          const order = await cursor.toArray();
          res.json(order);
        })

        app.post('/orders', async(req, res) =>{
            const orders = req.body;
            // console.log(orders)
            const result = await ordersCollection.insertOne(orders)
            res.json(result)
        })
        app.post('/users', async(req, res) => {
          const user = req.body;
          const result = await usersCollection.insertOne(user)
          // console.log(result)
          res.json(result)
        })

    }
    finally{
        // await client.close()
    }
}
run().then(console.dir)

app.get('/', (req, res) => {
  res.send('bd car organaizetion!')
})

app.listen(port, () => {
  console.log(`listening at :${port}`)
})