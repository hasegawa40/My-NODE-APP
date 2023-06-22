const axios = require("axios");
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// サンプルHTMLフォームを返すルートエンドポイント
app.get('/', (req, res) => {
    res.send(`
        <form action="/query" method="post">
            <label for="question">質問:</label><br>
            <input type="text" id="question" name="question" value="OpenAIは何ですか？"><br>
            <input type="submit" value="Submit">
        </form>
    `);
});

// フォームからの質問を処理するエンドポイント
app.post('/query', async (req, res) => {
    // フォームからの質問を取得します
    const question = req.body.question;

    // OpenAI APIキーを取得します
    const openAIKey = process.env.OPENAI_KEY;

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
        const answer = response.data.choices[0].text.trim();

        // ユーザーに回答を表示します
        res.send(`
            <h1>回答</h1>
            <p>${answer}</p>
            <a href="/">戻る</a>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send(`エラーが発生しました。: ${error.message}`);
    }
});

// サーバーを起動します
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`App is running on port ${port}`));
