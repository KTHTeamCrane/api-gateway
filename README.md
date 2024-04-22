This is the API gateway responsible for establishing connection between the web extension and the ML APIs.

# Overview
The API gateway has it's own endpoint through which the web extension can communicate. Furthermore, there are two ML APIs:
- Retrieval API
- LLM API


These APIs have their own RESTful endpoints. 

The API gateway establishes connection between these two layers.

# TODOs
There are two main tasks in this repo:
- Create functions to communicate with
    - the Retrieval API
    - the LLM API
- Create tests for the article extractor.

# Pre-requisites
- Should install `pnpm`. It's available on homebrew. Should be able to run `brew install pnpm`.
- After that, run `pnpm i` to install all the deps.
- Then you're good to go

# Running the server
To run the server, use `pnpm`
```
pnpm dev
```

# Time4Testing
This time, we gotta write unit tests.

## Writing said tests
There is a `/test` directory. This is where all the test code goes.

There is a `unit.test.ts` file which contains a dummy test. All tests should be written like that.

Create new files if you want to to make organisation easier.

**Make sure you export the functions that you need to test**

## Running test
```
pnpm test
```