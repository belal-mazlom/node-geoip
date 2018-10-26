# node-geoip
A Simple node app to look up country by IP address

# App requirements
- Redis to support caching results
- MongoDB to convert Country code to arabic and english name for it.

  import required db from database/cities

## Setup:

- npm i
- run redis
- import database `database/cities`
- run mongodb
- npm run start
- open site `http://localhost/3000`
