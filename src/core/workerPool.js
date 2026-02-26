export async function runWorkerPool({ totalRequests, concurrency, requestFn }) {
	let started = 0;
	let completed = 0;
	let results = [];

	async function worker() {
		while (true) {
			if (started >= totalRequests) return;

			const currentIndex = started;
			started++;

			const result = await requestFn();

			results[currentIndex] = result;
			completed++;

			process.stdout.write(`\rCompleted: ${completed}/${totalRequests}`);
		}
	}

	const workers = [];

	for (let i = 0; i < concurrency; i++) {
		workers.push(worker());
	}

	await Promise.all(workers);

	return results;
}
