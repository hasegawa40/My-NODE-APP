const axios = require("axios");
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 他の部分のコード...

app.post('/query', async (req, res) => {
    // フォームからの質問を取得します
    const question = req.body.question;

    // OpenAI APIキーを直接定義します
    const openAIKey = "7b424588f10c44cf8b6363d92b5756f4";

    // OpenAIに質問を送信します
    try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
            prompt: question,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${openAIKey}`
            }
        });

        // OpenAIからの回答を取得します
        const answer = response.data.choices[0].text;

        // ユーザーに回答を表示します
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

// サーバーを起動します
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is running on port ${port}`));
