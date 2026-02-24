import { Command } from "commander";
import chalk from "chalk";
import { sendRequest } from "../requestEngine.js";

const testCommand = new Command("test");

testCommand
	.description("Run a concurrency test on an API endpoint")
	.requiredOption("--url <string>", "Target API URL")
	.option("--method <string>", "HTTP method", "GET")
	.option("--concurrency <number>", "Number of concurrent workers", "1")
	.option("--requests <number>", "Total number of requests", "1")
	.action(async (options) => {
		const testStart = performance.now();
		const totalRequests = Number(options.requests);
		const concurrency = Number(options.concurrency);

		let started = 0;
		let completed = 0;
		let results = [];

		async function worker() {
			while (true) {
				if (started >= totalRequests) return;

				const currentIndex = started;
				started++;

				const result = await sendRequest({
					url: options.url,
					method: options.method,
				});

				results[currentIndex] = result;
				completed++;

				process.stdout.write(
					`\rCompleted: ${completed}/${totalRequests}`,
				);
			}
		}

		const workers = [];

		for (let i = 0; i < concurrency; i++) {
			workers.push(worker());
		}

		await Promise.all(workers);

		const testEnd = performance.now();
		const totalDurationSeconds = (testEnd - testStart) / 1000;

		const successCount = results.filter((r) => r.success).length;
		const clientErrors = results.filter(
			(r) => r.status >= 400 && r.status < 500,
		).length;
		const serverErrors = results.filter((r) => r.status >= 500).length;

		const latencies = results.map((r) => r.latency);
		const avgLatency =
			latencies.reduce((sum, val) => sum + val, 0) / results.length;

		const minLatency = Math.min(...latencies);
		const maxLatency = Math.max(...latencies);

		const throughput = totalRequests / totalDurationSeconds;

		console.log(chalk.blue("\n\nAPILOCK REPORT"));
		console.log("--------------------------------");
		console.log("Total Requests:", totalRequests);
		console.log("Concurrency:", concurrency);
		console.log("Success:", successCount);
		console.log("Client Errors (4xx):", clientErrors);
		console.log("Server Errors (5xx):", serverErrors);
		console.log("Min Latency:", minLatency.toFixed(2), "ms");
		console.log("Max Latency:", maxLatency.toFixed(2), "ms");
		console.log("Avg Latency:", avgLatency.toFixed(2), "ms");
		console.log("Throughput:", throughput.toFixed(2), "req/sec");
		console.log("--------------------------------");
	});

export default testCommand;
