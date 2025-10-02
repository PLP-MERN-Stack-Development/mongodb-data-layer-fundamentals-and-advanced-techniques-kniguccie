// Find all books in a specific genre
db.books.find({ genre: "Fantasy" });

// Find books published after a certain year
db.books.find({ publication_year: { $gt: 1900 } });

// Find books by a specific author
db.books.find({ author: "Jane Austen" });

// Update the price of a specific book
db.books.updateOne(
    { title: "Moby Dick" },
    { $set: { price: 13.99 } }
);

// Delete a book by its title
db.books.deleteOne({ title: "The Hobbit" });


// Write a query to find books that are both in stock and published after 2010
db.books.find({
    in_stock: true,
    publication_year: { $gt: 2010 }
});


// Use projection to return only the title, author, and price fields in your queries
db.books.find(
{
    in_stock:true,
    page:{$gt:400}
},
{_id:0,title:1,author:1,price:1});


// Implement sorting to display books by price ascending
db.books.aggregate([{$sort:{price:1}}]);

// Implement sorting to display books by price descending
db.books.aggregate([{$sort:{price:-1}}]);


// Use the `limit` and `skip` methods to implement pagination (5 books per page)
db.books.aggregate(
    { $match: {author: "Emily Brontë" }},
)
.skip((p - 1) * 5)
.limit(5);


// Create an aggregation pipeline to calculate the average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre", // Group by genre
      averagePrice: { $avg: "$price" } // Calculate average price
    }
  },
  {
    $project: {
      genre: "$_id", // Rename _id to genre
      averagePrice: { $round: ["$averagePrice", 2] }, // Round to 2 decimal places
      _id: 0 // Exclude _id field
    }
  }
]);


// Create an aggregation pipeline to find the author with the most books in the collection
db.books.aggregate([
  {
    $group: {
      _id: "$author", // Group by author
      bookCount: { $sum: 1 } // Count books per author
    }
  },
  {
    $sort: { bookCount: -1 } // Sort by book count in descending order
  },
  {
    $limit: 1 // Return only the top author
  },
  {
    $project: {
      author: "$_id", // Rename _id to author
      bookCount: 1, // Include book count
      _id: 0 // Exclude _id field
    }
  }
]);


//  Implement a pipeline that groups books by publication decade and counts them
db.books.aggregate([
  {
    $match: {
      publication_year: { $exists: true, $ne: null } // Ensure publication_year exists
    }
  },
  {
    $addFields: {
      decade: {
        $floor: { $divide: ["$publication_year", 10] } // Calculate decade (e.g., 1995 -> 199)
      }
    }
  },
  {
    $group: {
      _id: "$decade", // Group by decade
      bookCount: { $sum: 1 } // Count books per decade
    }
  },
  {
    $project: {
      decade: { $concat: [{ $toString: { $multiply: ["$_id", 10] } }, "s"] }, // Format as "1990s"
      bookCount: 1, // Include book count
      _id: 0 // Exclude _id field
    }
  },
  {
    $sort: { decade: 1 } // Sort by decade in ascending order
  }
]);


//  Create an index on the `title` field for faster searches
db.books.createIndex(
  { title: 1 },
  { collation: { locale: "en", strength: 2 } }
);


//  Create a compound index on `author` and `published_year`
db.books.createIndex(
  { author: 1, publication_year: 1 },
  { collation: { locale: "en", strength: 2 } }
);


//  Use the `explain()` method to demonstrate the performance improvement with your indexes
db.books.explain("executionStats").find(
  { title: "The Great Book" },
  { title: 1, author: 1, price: 1, _id: 0 }
);