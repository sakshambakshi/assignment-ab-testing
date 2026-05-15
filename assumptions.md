# A/B Testing System 

## Clear Assumptions and Constraints
- **Assumptions**: 
  - **Identity-Agnostic Engine**: While the current requirement uses an integer user_id (e.g., 42), the implementation is designed to be identity-agnostic. The defensive validation currently enforces numeric inputs, but the underlying MD5 hashing logic is natively compatible with alphanumeric strings or UUIDs.
  
  - **32-Bit Precision**: By extracting the first 8 characters of the MD5 hex string, the system derives a 32-bit integer representing $2^{32} - 1$ (4,294,967,295) unique values. This high-resolution space ensures a statistically uniform distribution when mapped to experiment buckets, satisfying the randomness requirements for A/B testing.

  - **Proportional Allocation**: The system utilizes a weighted distribution model to provide granular control over variant exposure. This approach allows for non-equal prioritization (e.g., a "ramp-up" phase where 90% of traffic remains on a control group).

  - **Configurable Target Sums**: The total weight for any experiment must align exactly with the TARGET_TOTAL_WEIGHT defined in the .env file. The application implements a fail-fast policy; if the sum of weights is mathematically invalid, the service will throw an error and terminate during the evaluation/startup phase to prevent corrupted data collection.

  - **Extensibility**: If a standard equal-split distribution is required later, the weights can simply be adjusted to equal values without modifying the core logic.

  - **Immutable Runtime Configuration**: Configurations are loaded into memory strictly at deployment/startup time. Any modifications to variant weights or experiment definitions require an application restart to pick up new environment variables.
  
  - **Stateless Determinism**: Because the output is derived solely from the input and the configuration salt, the system is entirely stateless. This ensures that as long as the weights remain the same, the user assignment will never flip, regardless of container restarts or horizontal scaling
  - **Validated Integrity**: The core distribution logic is covered by Jest test suites to ensure that variant frequencies remain proportional to the configured weights over a large sample size.



## Correctness Under Retries and Failures
- **Consistency**: Because variant assignment relies on a cryptographic hash (MD5) of the `experimentName` and `user_id`, the system is entirely stateless. 
- **Failure Handling**: If a request fails mid-flight or a client retries, the exact same variant is mathematically guaranteed to be returned. Similarly, container restarts or horizontal scaling (if applied later) have no impact on assignment consistency provided .env file configuration is not changed.

## Trade-offs and Alternatives Considered
- **Stateless Hashing vs. Stateful Storage (Database/Redis)**:
  - *Trade-off*: A stateless hash approach has virtually zero latency (<1ms) and infinite scalability without synchronization bottlenecks. However, if experiment weights are adjusted mid-experiment, the hash boundaries change, causing some existing users to be reassigned to a new variant. Moreover in the alternative (Stateful Storage Solution) if we use DB, we would have full control and clarity of what variant has been shared to a specific user and more options .To summarise the difference between stateful solution and stateless solutions is of trade-off between the ease of use and control and the latency and scalability.

- **Hashing Algorithm**:
  - MD5 was chosen for speed and uniform distribution. While not cryptographically secure against intentional collision attacks, it is standard and performant for A/B bucketing. SHA-256 was considered but deemed unnecessary overhead as its computationally heavy the other good alternative were MurmurHash but it was not available in nodejs by default and would require an extra dependency to be added to the project. Although as the usecase is not malicious and we are only taking the first 8 characters of the md5 hash which allows 2^32 - 1(4,294,967,295) possible values, which are more than enough to provide unique bucket assignment for the current use case.
- **Config Management**:
  - Environment variables were used for configuration. *Alternative*: A dynamic configuration polling system (like a JSON file watcher) could allow updating weights without restarting the container (& more extensibility for A/B testing like enabling/disabling tests dynamically or changing the weights of the tests on the fly), but it increases implementation complexity.

## Observability and Debuggability
- **Structured Logging**
  -**Machine-Readable Format**: Currently the default structured logging provided by **Winston** is enough for the current use case of this scale. The JSON structure contains all the necessary information about the request and the response that are needed to debug. However we can further improve it by adding a centralized logging system like ELK Stack (Elasticsearch, Logstash, Kibana) to collect, search, and analyze logs from multiple instances.
  - **Log Persistence & Rotation**: We are currently using a winston logger with a daily rotate file transport which rotates the logs every day and keeps the logs for 14 days (which can be changed via env variables) so thats logs are always fresh and available for debugging.
- **Observability While being aware of Performance**
  - **Async Logging**: We are using `setImmediate` to log the request and response after the response has been sent to the client. This is a trade-off between the latency of the response and the observability of the system.
  - **Response Interception**: Utilized monkey patching on res.json method as a pragmatic engineering choice to guarantee 100% audit accuracy without requiring developers to manually call logger.info in every controller action.
  - **Error Logging**: We are using a custom error handler(middleware) to catch all the errors and log them to both console and log files.
