import { Command } from "commander";
import chalk from "chalk";

const testCommand = new Command("test");

testCommand
	.description("Run a concurrency test on an API endpoint")
	.requiredOption("--url <string>", "Target API URL")
	.option("--method <string>", "HTTP method", "GET")
	.option("--concurrency <number>", "Number of concurrent workers", "1")
	.option("--requests <number>", "Total number of requests", "1")
	.action((options) => {
		console.log(chalk.blue("\nAPI Lock - Test Configuration\n"));
		console.log("URL:", options.url);
		console.log("Method:", options.method);
		console.log("Concurrency:", options.concurrency);
		console.log("Total Requests:", options.requests);
		console.log();
	});

export default testCommand;
