const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001;
app.use(express.json());

const Borrowing = [
    { id: "1", userId: "1", bookId: "1" },
    { id: "2", userId: "2", bookId: "1" },
];

// Route to get all borrowed books
app.get('/borrowed-books', async (req, res) => {
    try {
        const borrowedBooks = await getBorrowedBooksInfo(Borrowing);
        res.json(borrowedBooks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to borrow a book
app.post('/borrow', async (req, res) => {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
        return res.status(400).json({ error: 'Please provide userId and bookId for borrowing a book' });
    }

    try {
        // Check if the user and book exist
        const user = await getUserInfo(userId);
        const book = await getBookInfo(bookId);

        if (!user || !book) {
            return res.status(404).json({ error: 'User or book not found' });
        }

        // Check if the book is already borrowed
        if (Borrowing.some(entry => entry.userId === userId && entry.bookId === bookId)) {
            return res.status(400).json({ error: 'User already borrowed this book' });
        }

        // Add the borrowing entry
        const newBorrowing = { id: (Borrowing.length + 1).toString(), userId, bookId };
        Borrowing.push(newBorrowing);
        res.json(newBorrowing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to return a book
app.post('/return', async (req, res) => {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
        return res.status(400).json({ error: 'Please provide userId and bookId for returning a book' });
    }

    try {
        // Check if the user and book exist
        const user = await getUserInfo(userId);
        const book = await getBookInfo(bookId);

        if (!user || !book) {
            return res.status(404).json({ error: 'User or book not found' });
        }

        // Check if the user borrowed the book
        const borrowingEntryIndex = Borrowing.findIndex(entry => entry.userId === userId && entry.bookId === bookId);

        if (borrowingEntryIndex === -1) {
            return res.status(400).json({ error: 'User did not borrow this book' });
        }

        // Remove the borrowing entry
        const returnedBook = Borrowing.splice(borrowingEntryIndex, 1)[0];
        res.json(returnedBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function getBorrowedBooksInfo(borrowingList) {
    const borrowedBooks = [];

    for (const entry of borrowingList) {
        const user = await getUserInfo(entry.userId);
        const book = await getBookInfo(entry.bookId);
        borrowedBooks.push({
            id: entry.id,
            userName: user ? user.name : 'User not found',
            bookTitle: book ? book.name : 'Book not found',
        });
    }

    return borrowedBooks;
}

async function getUserInfo(userId) {
    try {
        const userResponse = await axios.get(`http://localhost:3002/users/${userId}`);
        return userResponse.data;
    } catch (error) {
        return null;
    }
}

async function getBookInfo(bookId) {
    try {
        const bookResponse = await axios.get(`http://localhost:3000/books/${bookId}`);
        return bookResponse.data;
    } catch (error) {
        return null;
    }
}

app.listen(port, () => {
    console.log(`Borrowing listening on port ${port}`);
});
