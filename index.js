const express = require('express');
const mongodb = require('mongodb');

const app = express();
const MongoClient = mongodb.MongoClient;

const dbUrl = 'mongodb+srv://newproject:SUJATA2005@cluster0.uv0ls.mongodb.net/'
const dbName = 'suja';

app.use(express.json());
let client;

// Initialize MongoDB connection once
async function connectDB() {
    if (!client) {
        try {
            client = await MongoClient.connect(dbUrl);
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            throw new Error('Failed to connect to MongoDB');
        }
    }
    return client.db(dbName);
}

// Get all users
app.get('/', async (req, res) => {
    try {
        const db = await connectDB();
        const users = await db.collection('userDetails').find().toArray();
        res.json({ message: 'Displaying all records', users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Insert new record
app.post('/', async (req, res) => {
    try {
        const db = await connectDB();
        const result = await db.collection('userDetails').insertOne(req.body);
        res.json({ message: 'Record inserted', insertedId: result.insertedId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Fetch user by id
app.get('/fetch/:id', async (req, res) => {
    try {
        const db = await connectDB();
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const user = await db.collection('userDetails').findOne({ id });
        if (user) {
            res.json({ message: 'Record Found', user });
        } else {
            res.status(404).json({ message: 'Record not Found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update user by name
app.put('/update/:name', async (req, res) => {
    try {
        const db = await connectDB();
        const name = req.params.name;
        const updateData = { $set: req.body };
        const result = await db.collection('userDetails').updateOne({ name }, updateData);

        if (result.modifiedCount > 0) {
            res.json({ message: 'Record Updated' });
        } else {
            res.status(404).json({ message: 'Record Not Found or No Change Made' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete user by name
app.delete('/delete/:name', async (req, res) => {
    try {
        const db = await connectDB();
        const name = req.params.name;
        const result = await db.collection('userDetails').deleteOne({ name });

        if (result.deletedCount > 0) {
            res.json({ message: 'Record Deleted' });
        } else {
            res.status(404).json({ message: 'Record Not Found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.listen(8081, () => console.log('Server is running on port 8081'));
