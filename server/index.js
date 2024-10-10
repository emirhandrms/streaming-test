const express = require("express");
const cors = require("cors");

const app = express();

// CORS'u global olarak etkinleştir
app.use(cors());

app.get("/stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let count = 0;
    const intervalId = setInterval(() => {
        count++;
        res.write(`data: ${JSON.stringify({ message: `Streaming data ${count}` })}\n\n`);

        if (count === 40) {
            clearInterval(intervalId);
            res.write("data: [Stream Ended]\n\n");
            res.end();
        }
    }, 300);

    req.on("close", () => {
        clearInterval(intervalId);
    });
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
