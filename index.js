const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;


const app = express();

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wgjsrij.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productsCollection = client.db('retailsMart').collection('products');
        const bookingProductsCollection = client.db('retailsMart').collection('bookingproducts');
        const usersCollection = client.db('retailsMart').collection('users');

        app.get('/products', async (req, res) => {
            const query = {}
            const getproducts = await productsCollection.find(query).toArray();
            res.send(getproducts)
        })


        app.post('/products', async (req, res) => {
            const addprod = req.body;

            const result = await productsCollection.insertOne(addprod);
            res.send(result);

        })

        app.get('/productsbookings', async (req, res) => {
            const query = {}
            const getproducts = await bookingProductsCollection.find(query).toArray();
            res.send(getproducts)
        })

        app.post('/productsbookings', async (req, res) => {
            const bookingproducts = req.body;

            const result = await bookingProductsCollection.insertOne(bookingproducts);
            res.send(result);

        })

        app.delete('/productsbookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const booking = await bookingProductsCollection.deleteOne(query);
            res.send(booking);

        })

        app.get('/category/:id', async (req, res) => {
            const id = req.params.id
            const query = { category: id }
            const getproducts = await productsCollection.find(query).toArray();
            res.send(getproducts)
        })


        app.get('/users', async (req, res) => {
            const query = {}
            const getusers = await usersCollection.find(query).toArray();
            res.send(getusers)
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { role: id }
            const getusers = await usersCollection.find(query).toArray();
            res.send(getusers)
        })

        // logged user booking
        app.get('/mybooking', async (req, res) => {
            const decoded = req.decoded;

            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = bookingProductsCollection.find(query)
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        // logged user only
        app.get('/user', async (req, res) => {
            const decoded = req.decoded;

            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = await usersCollection.findOne(query)

            res.send(cursor);
        })






        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(query);
            res.send(result);

        })



        app.put('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        app.put('/users/verify/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    profile: 'verified'
                }
            }
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })









    }
    finally {

    }

}
run().catch(console.log)



app.get('/', async (req, res) => {
    res.send('Retail Mart server is running')
})

app.listen(port, () => console.log(`Retail Mart running on ${port}`))