const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post('/register', function (req, res) {
	const { username, password } = req.body;
  
	// Check if both fields are provided
	if (!username || !password) {
	  return res.status(400).json({
		message: "Username and password are required for registration."
	  });
	}
  
	// Check if username already exists
	const userExists = users.some(user => user.username === username);
	if (userExists) {
	  return res.status(409).json({
		message: "Username already exists. Please choose a different one."
	  });
	}
  
	// Register the user
	users.push({ username, password });
  
	return res.status(200).json({
	  message: "User registered successfully!"
	});
  });

// Get the list of the books
public_users.get('/', (req, res) => {
	new Promise((resolve, reject) => {
		try {
			resolve(books)
		} catch (error) {
			reject(error)
		}
	})
	.then(booksList => res.status(200).json(booksList))
	.catch(error => res.status(500).json({message: "Something went wrong."}))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    
	new Promise((resolve, reject) => {
		try {
			const book = books[isbn];
			if (!book)
				reject(new Error("Book not found for the given ISBN."))
			else
				resolve(book)
		} catch (error) {
			reject(error)
		}
	})
	.then(book => res.status(200).json(book))
	.catch(error => res.status(404).json({message: error}))
})

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;

  new Promise((resolve, reject) => {

	  let matchedBooks = [];

	  for (let key in books)
	  {
		if (books[key].author.toLowerCase() === author.toLowerCase())
			matchedBooks.push(books[key]);
	  }
	  if (matchedBooks.length === 0)
			reject("Book not found for the given author.");
	  else
	  	resolve(matchedBooks);
  })
  .then(matchedBooks => res.status(200).json(matchedBooks))
  .catch(error => res.status(404).json({message: error}));
});

// Get all books based on title
public_users.get('/title/:title', (req, res) =>
{
  let title = req.params.title;

  new Promise((resolve, reject) => {
	let matchedTitles = [];

	for (let key in books)
	{
	  if (books[key].title.toLowerCase() === title.toLowerCase())
		  matchedTitles.push(books[key]);
	}
  
	if (matchedTitles.length === 0)
		reject("Book not found for the given title.");
	else
		resolve(matchedTitles)
  })
  .then(matchedTitles => res.status(200).json(matchedTitles))
  .catch(error => res.status(404).json({message: error}));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
	let isbn = req.params.isbn;
	
	if (!books[isbn])
		return (res.status(404).json({message: "Book not found for the given ISBN."}));
	
	let reviews = books[isbn].reviews;
  return res.status(200).json(reviews);
});

module.exports.general = public_users;
