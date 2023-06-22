

process.env.NODE_ENV = 'test';
const db = require('./db');
const Book = require('./models/book');
const request = require('supertest');
const app = require('./app');




describe('Get All Books', function() {
  beforeEach(async function() {
    await db.query('DELETE FROM books');

   
    let book = await Book.create({
        "isbn": "0691161518",
        "amazon_url": "http://a.co/eobPtX2",
        "author": "Matthew Laney",
        "language": "english",
        "pages": 264,
        "publisher": "Princeton University Press",
        "title": "Power-Up: Unlocking Hidden Math in Video Games",
        "year": 2017
      });
  });
  
  test('can get all books', async function() {
    let books = await Book.findAll();
    expect(books[0]).toMatchObject({
      "isbn": "0691161518",
      "amazon_url": "http://a.co/eobPtX2",
      "author": "Matthew Laney",
      "language": "english",
      "pages": 264,
      "publisher": "Princeton University Press",
      "title": "Power-Up: Unlocking Hidden Math in Video Games",
      "year": 2017
    });


    
  });


  describe('POSt /books', function(){

    test('create a book', async function(){

        const response = await request(app).post(`/books`).send({
            "isbn": "9780142437230",
            "amazon_url": "http://a.co/d2ckah7",
            "author": "Jane Austen",
            "language": "english",
            "pages": 352,
            "publisher": "Penguin Classics",
            "title": "Pride and Prejudice",
            "year": 1813
          }
          )
        expect(response.body.book).toHaveProperty("isbn");
    })
  })
  
  describe('GET /books/:isbn', function() {
    let result;
  
    beforeEach(async () => {
      result = await db.query(`
        INSERT INTO
          books (isbn, amazon_url, author, language, pages, publisher, title, year)
          VALUES (
            '123432122',
            'https://amazon.com/taco',
            'Elie',
            'English',
            100,
            'Nothing publishers',
            'my first book',
            2008
          )
          RETURNING isbn`);
  
      result = result.rows[0];
    });
  
    test('get 1 book using id', async function() {
      const response = await request(app).get(`/books/${result.isbn}`);
      expect(response.body.book).toHaveProperty("isbn");
      expect(response.body.book).toHaveProperty('amazon_url');
    });
  });

        
  describe("PUT /books/:id", function(){
    let result;
  
    beforeEach(async () => {
      result = await db.query(`
        INSERT INTO
          books (isbn, amazon_url, author, language, pages, publisher, title, year)
          VALUES (
            '123432122',
            'https://amazon.com/taco',
            'Elie',
            'English',
            100,
            'Nothing publishers',
            'my first book',
            2008
          )
          RETURNING isbn`);
  
      result = result.rows[0];
    });

    test('UPDATE a single book', async function(){

        const response = await request(app).put(`/books/${result.isbn}`).send({
            amazon_url: "https://taco.com",
            author: "mctest",
            language: "english",
            pages: 1000,
            publisher: "yeah right",
            title: "UPDATED BOOK",
            year: 2000
          })
          expect(response.body.book).toHaveProperty("isbn");
        expect(response.body.book.title).toBe("UPDATED BOOK");
    })
    test("Prevents a bad book update", async function () {
        const response = await request(app)
            .put(`/books/${result.isbn}`)
            .send({
              isbn: "32794782",
              badField: "DO NOT ADD ME!",
              amazon_url: "https://taco.com",
              author: "mctest",
              language: "english",
              pages: 1000,
              publisher: "yeah right",
              title: "UPDATED BOOK",
              year: 2000
            });
        expect(response.statusCode).toBe(200);
      });

    
  })

  

describe("DELETE /books/:id", function () {

    let result;
  
    beforeEach(async () => {
      result = await db.query(`
        INSERT INTO
          books (isbn, amazon_url, author, language, pages, publisher, title, year)
          VALUES (
            '123432122',
            'https://amazon.com/taco',
            'Elie',
            'English',
            100,
            'Nothing publishers',
            'my first book',
            2008
          )
          RETURNING isbn`);
  
      result = result.rows[0];
    });


    test("Deletes a single a book", async function () {
      const response = await request(app)
          .delete(`/books/${result.isbn}`)
      expect(response.body).toEqual({message: "Book deleted"});
    });
  });

  })
  



afterAll(async function() {
  await db.end();
});



afterAll(async function () {
    await db.end()
  });