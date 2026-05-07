import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { RouterProvider } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { router } from "@/router";
import { queryClient } from "@/shared/lib/queryClient";
import "@/i18n/config";

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
				<Suspense
					fallback={
						<div className="flex min-h-svh items-center justify-center bg-background">
							<div className="text-stone-400 dark:text-stone-500">Yükleniyor...</div>
						</div>
					}
				>
					<RouterProvider router={router} />
				</Suspense>
				<Toaster position="bottom-right" richColors />
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default App;
