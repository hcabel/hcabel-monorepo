import { ITelemetryApiQueries } from "@hcabel/types/TelemetryApi";

export function get_all_visit(queryParams: `?${string}`): Promise<ITelemetryApiQueries>
{
	return (
		fetch(
			`${process.env.NX_TELEMETRY_API_ENDPOINT}/visits${queryParams}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		)
			.then((response) => response.json())
	);
}

export function create_visit(href: string): Promise<Response>
{
	return (
		fetch(
			`${process.env.NX_TELEMETRY_API_ENDPOINT}/visits`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					href: href,
				}),
			},
		)
	);
}