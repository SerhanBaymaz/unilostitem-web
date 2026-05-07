import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const themeOrder = ["system", "dark", "light"] as const;

export function ThemeToggle() {
	const { theme, setTheme, resolvedTheme } = useTheme();
	const { t } = useTranslation();

	const cycleTheme = () => {
		const currentIndex = themeOrder.indexOf(theme as (typeof themeOrder)[number]);
		const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
		setTheme(nextTheme);
	};

	const effectiveTheme = theme === "system" ? "system" : resolvedTheme;

	return (
		<Button
			variant="ghost"
			size="icon-sm"
			className="relative h-8 w-10"
			onClick={cycleTheme}
			aria-label={t("common.toggleTheme")}
		>
			<Sun
				className={`h-4 w-4 transition-all ${
					effectiveTheme === "light" ? "rotate-0 scale-100" : "rotate-90 scale-0 absolute"
				}`}
			/>
			<Moon
				className={`h-4 w-4 transition-all ${
					effectiveTheme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0 absolute"
				}`}
			/>
			<Monitor
				className={`h-4 w-4 transition-all ${
					effectiveTheme === "system" ? "rotate-0 scale-100" : "-rotate-90 scale-0 absolute"
				}`}
			/>
		</Button>
	);
}
