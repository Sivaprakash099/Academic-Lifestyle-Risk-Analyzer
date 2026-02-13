const express = require('express');
const app = express();
const PORT = 5003;

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(PORT, () => {
    console.log(`Minimal Server running on port ${PORT}`);
});
