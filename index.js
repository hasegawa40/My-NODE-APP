const axios = require("axios");
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Hello, World!');
});

app.post('/query', async (req, res) => {
    const question = req.body.question;
    const openAIKey = "7b424588f10c44cf8b6363d92b5756f4";
    try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
            prompt: question,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${openAIKey}`
            }
        });

        const answer = response.data.choices[0].text;
        res.send(`
            <h1>回答</h1>
            <p>${answer}</p>
            <a href="/">戻る</a>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send('エラーが発生しました。: ${error.message}');
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is running on port ${port}`));
