import { Command } from "commander";
import { sendRequest } from "../core/requestEngine.js";
import { runWorkerPool } from "../core/workerPool.js";
import { calculateMetrics } from "../core/metrics.js";
import { formatReport } from "../core/formatReport.js";

const testCommand = new Command("test");

testCommand
	.description("Run a concurrency test on an API endpoint")
	.requiredOption("--url <string>", "Target API URL")
	.option("--method <string>", "HTTP method", "GET")
	.option("--concurrency <number>", "Number of concurrent workers", "1")
	.option("--requests <number>", "Total number of requests", "1")
	.action(async (options) => {
		const totalRequests = Number(options.requests);
		const concurrency = Number(options.concurrency);

		const testStart = performance.now();

		const results = await runWorkerPool({
			totalRequests,
			concurrency,
			requestFn: () =>
				sendRequest({ url: options.url, method: options.method }),
		});

		const testEnd = performance.now();
		const totalDurationSeconds = (testEnd - testStart) / 1000;

		const metrics = calculateMetrics(
			results,
			totalRequests,
			totalDurationSeconds,
		);

		console.log(formatReport({ totalRequests, concurrency, metrics }));
	});

export default testCommand;
