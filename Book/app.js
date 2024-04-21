const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const Books = [
    { bid: "1", name: "book1", author: "taimoor" },
    { bid: "2", name: "book2", author: "anwar" },
];

app.use(express.json());

// Route to get all books
app.get('/books', (req, res) => {
    res.json(Books);
});

// Route to get book by ID
app.get('/books/:bid', (req, res) => {
    const bookId = req.params.bid;
    const book = Books.find(b => b.bid === bookId);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

// Route to add a new book
app.post('/books', (req, res) => {
    const { bid, name, author } = req.body;

    if (!bid || !name || !author) {
        return res.status(400).json({ error: 'Please provide bid, name, and author for book addition' });
    }

    if (Books.some(book => book.bid === bid)) {
        return res.status(400).json({ error: 'Book with this BID already exists' });
    }

    const newBook = { bid, name, author };
    Books.push(newBook);
    res.json(newBook);
});

app.listen(port, () => {
    console.log(`Book listening on port ${port}`);
});