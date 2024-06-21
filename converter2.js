const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Test = require('./test'); 
const Question = require('./testquestions'); 

const uri = 'mongodb://127.0.0.1:27017/Testingquizbank';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

async function importData() {
    try {
      const jsonData = fs.readFileSync(path.join(__dirname, 'testquestions.json'), 'utf-8');
      const data = JSON.parse(jsonData);
        for (const testData of data) {
        const { questions, ...testDetails } = testData;
        const test = new Test(testDetails);
        const savedTest = await test.save();
        const questionIds = [];
        for (const questionData of questions) {
        const question = new Question({
            ...questionData,
            testId: savedTest._id, 
            testName: savedTest.testName 
          });
          const savedQuestion = await question.save();
          questionIds.push(savedQuestion._id);
        }
          savedTest.questions = questionIds;
        await savedTest.save();
      }
  
      console.log('Data successfully imported');
      process.exit();
    } catch (error) {
      console.error('Error importing data:', error);
      process.exit(1);
    }
  }
  
  importData();