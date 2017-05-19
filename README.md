# Quote service (node test)
Simple node app with to create users/quotes and share quotes between users

## Starting the app

1. Copy the repository `git clone "gitrepo url here"`
2. Configure your environment in `.env`. Required environment variables are listed below
3. Run `npm install` or `yarn`
4. Start the dev server `npm run dev` or `yarn run dev`

### Required environment variables
- SECRET - your secret to hash users password
- API_KEY - your email transport api key
- DATABASE_URL - url of your production postgres database

*Note: Instead of DATABASE_URL you can provide `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` variables for development mode*

### Requirements
- Node.js >= 6.9
- npm >= 3.0.0
- yarn optional

# API endpoints
## Authentication
`POST /v1/auth/login` - receive access token
---
`POST /v1/auth/register` - register a new user / receive access token
---
## Users
`POST /v1/users` - create a new user
---
`GET /v1/users` - get all users
---
## Quotes
`POST /v1/quotes` - create a new quote
---
`GET /v1/quotes` - get all quotes
---
`GET /v1/quotes/offered` - get all quotes offered by user
---
`GET /v1/quotes/offers` - get all quotes offered to user
---
`POST /v1/quotes/offer` - offer quote to user
---
`PUT /v1/quotes/id` - accept/reject offered quote
---

*More detailed route specification you can find at `routes` folder under the specific route file*

# Test

For testing run command `npm run test` or `yarn run test`
