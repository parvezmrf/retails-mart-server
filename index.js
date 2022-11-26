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

        app.get('/products', async (req, res) => {
            const query = {}
            const getproducts = await productsCollection.find(query).toArray();
            res.send(getproducts)
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