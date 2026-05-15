# A/B Testing Backend

This is a backend-driven A/B experimentation system that deterministically assigns users to variants and serves experiment configurations to frontend clients. It is built using Node.js, Express, and TypeScript.

## How to build
To build the Docker image, run the following command in the project root:
```bash
docker build -t ab-testing .
```

## How to run (Docker Compose)
We have configured `docker-compose.yml` to support both development (with hot-reloading) and production locally.

To run the **development** environment (hot-reloads on file changes in `src/`):
```bash
docker-compose up api-dev --build
```

To run the **production** environment:
```bash
docker-compose up api-prod --build
```

## How to run (Standalone Docker)
To build and run the standalone Docker container locally:
```bash
docker build -t ab-testing .
docker run -p 8080:8080 -d ab-testing
```
## How to trigger the core functionality
You can test the endpoint by passing a `user_id`(which should be a positive integer) query parameter to the `/experiment` endpoint. Using `curl` as mentioned in the assignment:

```bash
curl "localhost:8080/experiment?user_id=42"
```

## How to run tests
The project uses `jest` and `supertest` for testing endpoints, validation, and statistical bucketing distribution.

**To run tests inside the Docker container:**
```bash
docker-compose exec api-dev npm test
```

**To run tests locally (requires Node installed locally):**
```bash
npm install
npm test
```

## Architecture choice and reasoning
- **Node.js & Express**: Simple, lightweight framework that is well-suited for fast HTTP microservices and simple routing.
- **TypeScript**: Enforce types safety in the codebase and catch errors at compile time.
- **Deterministic Assignment Strategy**: The application uses a MD5 hashing algorithm on `user_id` and experiment group in a format `${experimentName}-${userId}` (as of now there is one experiment group but code is written such a way that multiple groups can be added) to assign users to consistent variant. By taking the hash, converting a substring to an integer, and applying a modulo operation (based on the value of total weights), we ensure that the same `user_id` will consistently receive the same variant across any number of requests and at a same time if needed a   particular variant can be prioritised as per weights.
- **Stateless Application**: The application is stateless and all the configuration is stored in the **.env** files. This makes it easy to scale the application horizontally and re-deploy it without losing any data.
- **Structured Logging**: Uses `Winston` to emit structured JSON logs. A custom `requestLogger` middleware intercepts responses to log the full context (method, path, body). Log rotation is implemented via `winston-daily-rotate-file`, writing to `src/logs/` to persist files locally even after the container stops, retaining a maximum of 14 days of logs and 10mb log size so that log files don't take up too much space.
- **Decoupled Experiment Data**: The experiment configurations are abstracted out of the services into `src/data/experimentData.ts`, making it highly extensible to add new experiments or fetch them from external APIs/DBs in the future.

## Assumptions & Trade-offs
For a detailed breakdown of trade-offs, constraints, and recommendations from a senior architect perspective, please read the included [assumptions.md](./assumptions.md) file.
