export type ItemType = "Lost" | "Found";

export type ClaimStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";

export type UserRole = "User" | "Admin";

export const ITEM_CATEGORIES = [
	"Electronics",
	"IdentificationCard",
	"BagWallet",
	"ClothingAccessory",
	"BookStationery",
	"Key",
	"Documents",
	"HealthMedical",
	"Other",
] as const;

export type Category = (typeof ITEM_CATEGORIES)[number];

export type SortField = "createdAt" | "title" | "incidentDate";

export interface Location {
	label: string;
	latitude: number;
	longitude: number;
}
