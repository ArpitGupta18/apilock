export function calculateMetrics(results, totalRequests, totalDurationSeconds) {
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

	const statusBreakdown = {};

	results.forEach((r) => {
		statusBreakdown[r.status] = (statusBreakdown[r.status] || 0) + 1;
	});

	const totalAttempts = results.reduce(
		(sum, r) => sum + (r.attempts || 1),
		0,
	);

	const retriedRequests = results.filter(
		(r) => r.attempts && r.attempts > 1,
	).length;

	const avgAttempts = totalAttempts / results.length;
	return {
		successCount,
		clientErrors,
		serverErrors,
		avgLatency,
		minLatency,
		maxLatency,
		throughput,
		statusBreakdown,
		totalAttempts,
		retriedRequests,
		avgAttempts,
	};
}
