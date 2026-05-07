import { describe, expect, it } from "vitest";
import type { StandardApiResponse } from "./api";

describe("StandardApiResponse types", () => {
	it("accepts a successful response with data", () => {
		const response: StandardApiResponse<string[]> = {
			success: true,
			data: ["item1", "item2"],
			timestamp: "2026-01-01T00:00:00Z",
		};

		expect(response.success).toBe(true);
		expect(response.data).toHaveLength(2);
	});

	it("accepts a failed response with message", () => {
		const response: StandardApiResponse<unknown> = {
			success: false,
			message: "Not found",
			timestamp: "2026-01-01T00:00:00Z",
		};

		expect(response.success).toBe(false);
		expect(response.message).toBe("Not found");
	});

	it("accepts a paged response with pagination", () => {
		const response: StandardApiResponse<number[]> = {
			success: true,
			data: [1, 2, 3],
			timestamp: "2026-01-01T00:00:00Z",
			pagination: {
				pageNumber: 1,
				pageSize: 10,
				totalPages: 2,
				totalCount: 15,
			},
		};

		expect(response.pagination?.pageNumber).toBe(1);
		expect(response.pagination?.totalCount).toBe(15);
	});
});
