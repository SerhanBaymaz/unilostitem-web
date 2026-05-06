import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
	const { t } = useTranslation();

	if (totalPages <= 1) return null;

	const getPageNumbers = (): (number | "ellipsis")[] => {
		const pages: (number | "ellipsis")[] = [];
		const delta = 1;

		for (let i = 1; i <= totalPages; i++) {
			if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
				pages.push(i);
			} else if (pages[pages.length - 1] !== "ellipsis") {
				pages.push("ellipsis");
			}
		}

		return pages;
	};

	return (
		<div className={className}>
			{/* Desktop — page buttons */}
			<div className="hidden items-center justify-center gap-1.5 md:flex">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage <= 1}
					className="h-9 w-9"
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>

				{getPageNumbers().map((page, index) =>
					page === "ellipsis" ? (
						<span key={`ellipsis-${index}`} className="px-1 text-sm text-text-tertiary">
							...
						</span>
					) : (
						<button
							key={page}
							onClick={() => onPageChange(page)}
							className={`h-9 w-9 rounded text-[13px] font-medium transition-colors ${
								currentPage === page
									? "bg-stone-900 text-background"
									: "text-stone-600 hover:bg-stone-100"
							}`}
						>
							{page}
						</button>
					),
				)}

				<Button
					variant="ghost"
					size="icon"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage >= totalPages}
					className="h-9 w-9"
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>

			{/* Mobile — load more */}
			<div className="flex justify-center md:hidden">
				{currentPage < totalPages && (
					<Button
						variant="outline"
						onClick={() => onPageChange(currentPage + 1)}
						className="min-h-[48px] min-w-[200px]"
					>
						<ChevronRight className="mr-1 h-4 w-4" />
						{t("common.next")}
					</Button>
				)}
			</div>
		</div>
	);
}
