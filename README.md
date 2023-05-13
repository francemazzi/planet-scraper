## This is my simple boilerplate for node.js with typescript

![Alt text](/data/scraper.png "Scrape supermarket price data")

This boilerplate was created using express.js and node.js, and pptr (puppeteer) to scrape data from websites. The application runs on http://localhost:8080/.

# Importing data

When importing an index file, you cannot use the syntax import {<IMPORT-NAME>} from "./data". Instead, you must use the syntax import {<IMPORT.NAME>} from "./data.js".

## TO DO 🔥

- Integration with db
- Scrape data from other websites such as Lidl, Coop, etc.
- Optimize API with dynamic reloading of data
- Create frontend using React and TypeScript.
