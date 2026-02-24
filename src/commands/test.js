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
		console.log(chalk.blue("\nAPI Lock - Test Configuration\n"));
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

		const successCount = results.filter((r) => r.success).length;
		const avgLatency =
			results.reduce((sum, r) => sum + r.latency, 0) / results.length;

		console.log("\nTest Summary:");
		console.log("Total:", totalRequests);
		console.log("Success:", successCount);
		console.log("Failures:", totalRequests - successCount);
		console.log("Avg Latency:", avgLatency.toFixed(2), "ms");
		console.log();
	});

export default testCommand;
