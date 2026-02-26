import axios from "axios";

export async function sendRequest({ url, method, headers = {}, body = null }) {
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

		return {
			status: response.status,
			latency: end - start,
			success: response.status >= 200 && response.status < 300,
		};
	} catch (error) {
		const end = performance.now();

		return {
			status: 0,
			latency: end - start,
			success: false,
			error: error.message,
		};
	}
}
