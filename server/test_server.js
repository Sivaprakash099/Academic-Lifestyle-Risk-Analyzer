const express = require('express');
const app = express();

app.use((req, res, next) => {
    console.log("Request received:", req.url);
    next();
});

app.get('/api/test', (req, res) => {
    res.json({ message: "Test Server Works" });
});

app.listen(5001, () => {
    console.log("Test Server running on port 5001");
});
