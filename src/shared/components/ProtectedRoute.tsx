import { Navigate, Outlet } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/features/auth/store/authStore";

export function ProtectedRoute() {
	const { isAuthenticated, isLoading } = useAuthStore();

	if (isLoading) {
		return (
			<div className="flex min-h-svh items-center justify-center bg-background">
				<div className="space-y-4 text-center">
					<Skeleton className="mx-auto h-8 w-32" />
					<Skeleton className="mx-auto h-4 w-48" />
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
}
