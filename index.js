import { Configuration, OpenAIApi } from "openai";
import dotenv from 'dotenv';
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORGANIZATION,
});


const openai = new OpenAIApi(configuration);



//initialize express
const app = express();
//set port
const port = process.env.PORT || 5000;
 
// app should use body-parser and cors
app.use(bodyParser.json());
app.use(cors());



app.post("/", async (req, res) => {

    const { messages } = req.body;

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { "role": "system", "content": "You area a AI poet. Your purpose is to create poetry based on weather data. When you recieve weather data, determine what kind of natural imagery comes to mind?. Use elements of the imagery to create a poem. You may only use one of five short poetic forms: Haiku, Tanka, Cinquain, Limerick, or Fib. A specific location in the world must be specified - ask for one if one has not been given." },
            ...messages
        ]
    });

    res.json({ 
        completion: completion.data.choices[0].message
    });

});

app.listen(port, () => {
    console.log(`Server is running on port: http://localhost:${port}`);
});






