Node.js project built using postgreSQL database, graphQL and prisma.  
  
PostgreSQL database:  

There are 4 tables in database (User, Joke, Comment, Review). Users can be jokers or reviewers, both of which can write (delete/update) jokes and comments, but only reviewers can write or delete reviews.

Users can subscribe to author's jokes or to new comments.

Jokes are queried by string which are contained in jokes title or text, or by minimum rate. Comments and reviews are queried by author or by joke.  

Technologies/libraries used:  
- prisma-binding (for using prisma in node.js project)  
- graphql-yoga (for building graphql server)  
- bcrypt.js (for hashing passwords)  
- jsonwebtoken (implementation of web token, for authenticating)
- babel (for using ECMAscript newer generation)
