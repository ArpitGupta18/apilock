import { Command } from "commander";
import { sendRequest } from "../core/requestEngine.js";
import { runWorkerPool } from "../core/workerPool.js";
import { calculateMetrics } from "../core/metrics.js";
import { formatReport } from "../utils/formatReport.js";
import fs from "fs";

const testCommand = new Command("test");

testCommand
	.description("Run a concurrency test on an API endpoint")
	.requiredOption("--url <string>", "Target API URL")
	.option("--method <string>", "HTTP method", "GET")
	.option("--concurrency <number>", "Number of concurrent workers", "1")
	.option("--requests <number>", "Total number of requests", "1")
	.option("--body <path>", "Path to JSON body file")
	.option("--header <value...>", "Custom headers (key:value format)")
	.option("--retries <number>", "Retry attempts for failed requests", "0")
	.action(async (options) => {
		const totalRequests = Number(options.requests);
		const concurrency = Number(options.concurrency);
		const retries = Number(options.retries);
		let headers = {};

		if (options.header) {
			options.header.forEach((h) => {
				const [key, ...rest] = h.split(":");
				headers[key.trim()] = rest.join().trim();
			});
		}

		let body = null;

		if (options.body) {
			try {
				const fileContent = fs.readFileSync(options.body, "utf-8");
				body = JSON.parse(fileContent);
			} catch (error) {
				console.error("Invalid JSON body file.");
				process.exit(1);
			}
		}
		const testStart = performance.now();

		const results = await runWorkerPool({
			totalRequests,
			concurrency,
			requestFn: () =>
				sendRequest({
					url: options.url,
					method: options.method,
					headers,
					body,
					retries,
				}),
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
