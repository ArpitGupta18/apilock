#!/usr/bin/env node
import { Command } from "commander";
import testCommand from "./commands/test.js";

const program = new Command();

program
	.name("apilock")
	.description("Concurrency &  Rate-Limit Testing CLI Tool")
	.version("1.0.0");

program.addCommand(testCommand);
program.parse(process.argv);
