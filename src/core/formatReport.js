import chalk from "chalk";

export function formatReport({ totalRequests, concurrency, metrics }) {
	return `
    
${chalk.blue("API LOCK REPORT")}
--------------------------------
Total Requests: ${totalRequests}
Concurrency: ${concurrency}
Success: ${metrics.successCount}
Client Errors (4xx): ${metrics.clientErrors}
Server Errors (5xx): ${metrics.serverErrors}
Min Latency: ${metrics.minLatency.toFixed(2)} ms
Max Latency: ${metrics.maxLatency.toFixed(2)} ms
Avg Latency: ${metrics.avgLatency.toFixed(2)} ms
Throughput: ${metrics.throughput.toFixed(2)} req/sec
--------------------------------
`;
}
