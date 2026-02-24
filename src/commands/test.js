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

		const result = await sendRequest({
			url: options.url,
			method: options.method,
		});

		console.log("Status:", result.status);
		console.log("Latency:", result.latency.toFixed(2), "ms");
		console.log("Success:", result.success);
		console.log();
	});

export default testCommand;
