const { MongoClient } = require('mongodb');
const fs = require('fs');
const uri = 'mongodb://127.0.0.1:27017/quizbank'; 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function fetchAndConvertToJSON() {
    try {
        await client.connect(); 

        const database = client.db('quizbank'); 
        const collection = database.collection('tests');
        const documents = await collection.find({}).toArray();
        const jsonData = JSON.stringify(documents, null, 2);
        fs.writeFileSync('tests.json', jsonData);

        console.log('Data successfully fetched and converted to JSON. Check tests.json file.');
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        await client.close(); 
    }
}

fetchAndConvertToJSON();
