import { Outlet } from "react-router";
import { Header } from "@/shared/components";

export default function MainLayout() {
	return (
		<div className="flex min-h-svh flex-col bg-background">
			<Header />
			<main className="flex-1">
				<Outlet />
			</main>
		</div>
	);
}
