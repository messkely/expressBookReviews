const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
	const { username, password } = req.body;
  
	if (!username || !password)
	  return res.status(400).json({ message: "Username and password are required for login." });
  
	let user = users.find(u => u.username === username && u.password === password);
	if (!user)
	  return res.status(401).json({ message: "Invalid login credentials." });
  
	// Match secret with what's used in middleware
	const accessToken = jwt.sign({ username: user.username }, "access", { expiresIn: "1h" });
  
	// Store token and username in session
	req.session.authorization = { accessToken, username: user.username };
  
	return res.status(200).json({ message: "Login successful", token: accessToken });
  });
  

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	let isbn = req.params.isbn;
	let review = req.query.review;

	// Check if not exists
	if (!review)
		return (res.status(400).json({message: "Review is required as a query parameter."}));

	const username = req.session.authorization?.username;
	if (!username)
		return (res.status(401).json({message: "You must be logged in to post review."}));

	if (!books[isbn])
		return (res.status(404).json({message: "Book not found."}));

	// Initialize reviews object if not already present
	if (!books[isbn].reviews)
		books[isbn].reviews = {};

	// Store review under username
	books[isbn].reviews[username] = review;

  return res.status(200).json({message: "Review added/updated successfully."});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
	let isbn = req.params.isbn;
	let username = req.session.authorization.username

	if (!username)
		return (res.status(401).json({message: "You must be logged in to delete a review."}));

	if (!books[isbn])
		return (res.status(404).json({message: "Book not found."}));
	const bookReviews = books[isbn].reviews;

	if (!bookReviews || !bookReviews[username])
		return (res.status(404).json({message: "You have not posted a review for this book."}));

	delete bookReviews[username];

	return (res.status(200).json({message: "You review has been deleted successfully."}));
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
