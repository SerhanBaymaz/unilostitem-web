import { Link, Outlet } from "react-router";

export default function AuthLayout() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center bg-surface-warm px-4 py-8">
			<div className="w-full max-w-md">
				{/* Logo */}
				<Link
					to="/"
					className="mb-8 block text-center font-heading text-2xl text-stone-900"
				>
					UniLostItem
				</Link>

				{/* Card */}
				<div className="rounded-lg border border-stone-200 bg-card p-6 shadow-warm-1 sm:p-8">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
