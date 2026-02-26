import axios from "axios";

export async function sendRequest({
	url,
	method,
	headers = {},
	body = null,
	retries = 0,
}) {
	let attempt = 0;

	while (attempt <= retries) {
		const start = performance.now();
		try {
			const response = await axios({
				url,
				method,
				headers,
				data: body,
				validateStatus: () => true,
			});

			const end = performance.now();

			const isSuccess = response.status >= 200 && response.status < 300;
			if (isSuccess || attempt === retries)
				return {
					status: response.status,
					latency: end - start,
					success: isSuccess,
					attempts: attempt + 1,
				};
		} catch (error) {
			if (attempt >= retries) {
				return {
					status: 0,
					latency: 0,
					success: false,
					attempts: attempt + 1,
					error: error.message,
				};
			}
		}
		attempt++;
	}
}
