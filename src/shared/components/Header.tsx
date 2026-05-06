import { LayoutDashboard, LogIn, LogOut, Menu, Plus, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useLocaleStore } from "@/shared/store/localeStore";

const publicNavLinks = [{ path: "/", labelKey: "nav.home" }] as const;

const authNavLinks = [
	{ path: "/my-items", labelKey: "profile.myItems" },
	{ path: "/my-claims", labelKey: "profile.myClaims" },
	{ path: "/received-claims", labelKey: "nav.receivedClaims" },
] as const;

const adminNavLinks = [{ path: "/admin", labelKey: "nav.admin" }] as const;

export function Header() {
	const { t, i18n } = useTranslation();
	const { user, isAuthenticated, logout } = useAuthStore();
	const { setLocale } = useLocaleStore();
	const location = useLocation();
	const navigate = useNavigate();

	const handleLocaleChange = (newLocale: "tr" | "en") => {
		setLocale(newLocale);
		i18n.changeLanguage(newLocale);
	};

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const isActive = (path: string) => {
		if (path === "/") return location.pathname === "/";
		return location.pathname.startsWith(path);
	};

	const isAdmin = user?.role === "Admin";
	const navLinks = isAuthenticated
		? isAdmin
			? adminNavLinks
			: [...publicNavLinks, ...authNavLinks]
		: publicNavLinks;

	return (
		<header className="sticky top-0 z-50 border-b border-stone-200 bg-background/95 backdrop-blur-sm">
			<div className="mx-auto flex h-[60px] max-w-screen-xl items-center justify-between px-4 md:px-6">
				{/* Logo */}
				<Link to="/" className="font-heading text-xl text-stone-900">
					UniLostItem
				</Link>

				{/* Desktop Nav Links */}
				<nav className="hidden items-center gap-1 md:flex">
					{navLinks.map((link) => (
						<Link
							key={link.path}
							to={link.path}
							className={`rounded-md px-3 py-1.5 text-[13px] font-medium uppercase tracking-[0.08em] transition-colors ${
								isActive(link.path) ? "text-stone-900" : "text-stone-500 hover:text-stone-900"
							}`}
						>
							{t(link.labelKey)}
						</Link>
					))}
				</nav>

				{/* Desktop Controls */}
				<div className="hidden items-center gap-2 md:flex">
					{isAuthenticated && !isAdmin && (
						<Button size="sm" render={<Link to="/items/new" />} className="h-8 gap-1.5 px-3">
							<Plus className="h-4 w-4" />
							{t("items.addItem")}
						</Button>
					)}

					{/* Locale Toggle */}
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									variant="ghost"
									size="icon-sm"
									className="flex items-center justify-center h-8 w-10"
								/>
							}
						>
							<img
								src={`https://flagcdn.com/w40/${i18n.language === "tr" ? "tr" : "us"}.png`}
								alt={i18n.language}
								className="h-3 w-auto rounded-[1px] shadow-sm"
							/>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => handleLocaleChange("tr")}
								className="gap-2 cursor-pointer"
							>
								<img
									src="https://flagcdn.com/w40/tr.png"
									alt="TR"
									className="h-3 w-auto rounded-[1px]"
								/>
								<span className="text-[13px]">Türkçe</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleLocaleChange("en")}
								className="gap-2 cursor-pointer"
							>
								<img
									src="https://flagcdn.com/w40/us.png"
									alt="US"
									className="h-3 w-auto rounded-[1px]"
								/>
								<span className="text-[13px]">English</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Auth Menu */}
					{isAuthenticated && user ? (
						<DropdownMenu>
							<DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
								<Avatar className="h-7 w-7">
									<AvatarFallback className="bg-stone-100 text-xs font-semibold text-stone-600">
										{user.firstName[0]}
										{user.lastName[0]}
									</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuGroup>
									<DropdownMenuLabel>
										{user.firstName} {user.lastName}
									</DropdownMenuLabel>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => navigate("/profile")}>
									<User className="h-4 w-4" />
									{t("nav.profile")}
								</DropdownMenuItem>
								{user.role === "Admin" && (
									<DropdownMenuItem onClick={() => navigate("/admin")}>
										<LayoutDashboard className="h-4 w-4" />
										{t("nav.admin")}
									</DropdownMenuItem>
								)}
								<DropdownMenuSeparator />
								<DropdownMenuItem variant="destructive" onClick={handleLogout}>
									<LogOut className="h-4 w-4" />
									{t("nav.logout")}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<div className="flex items-center gap-2">
							<Button variant="ghost" size="sm" render={<Link to="/login" />}>
								{t("nav.login")}
							</Button>
							<Button size="sm" render={<Link to="/register" />}>
								{t("nav.register")}
							</Button>
						</div>
					)}
				</div>

				{/* Mobile Controls */}
				<div className="flex items-center gap-1 md:hidden">
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									variant="ghost"
									size="icon-sm"
									className="flex items-center justify-center h-9 w-10"
								/>
							}
						>
							<img
								src={`https://flagcdn.com/w40/${i18n.language === "tr" ? "tr" : "us"}.png`}
								alt={i18n.language}
								className="h-3.5 w-auto rounded-[1px] shadow-sm"
							/>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => handleLocaleChange("tr")}
								className="gap-2 cursor-pointer"
							>
								<img
									src="https://flagcdn.com/w40/tr.png"
									alt="TR"
									className="h-3.5 w-auto rounded-[1px]"
								/>
								<span>Türkçe</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleLocaleChange("en")}
								className="gap-2 cursor-pointer"
							>
								<img
									src="https://flagcdn.com/w40/us.png"
									alt="US"
									className="h-3.5 w-auto rounded-[1px]"
								/>
								<span>English</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{isAuthenticated ? (
						<DropdownMenu>
							<DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
								<Avatar className="h-7 w-7">
									<AvatarFallback className="bg-stone-100 text-xs font-semibold text-stone-600">
										{user?.firstName[0]}
										{user?.lastName[0]}
									</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuGroup>
									<DropdownMenuLabel>
										{user?.firstName} {user?.lastName}
									</DropdownMenuLabel>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => navigate("/profile")}>
									<User className="h-4 w-4" />
									{t("nav.profile")}
								</DropdownMenuItem>
								{user?.role === "Admin" && (
									<DropdownMenuItem onClick={() => navigate("/admin")}>
										<LayoutDashboard className="h-4 w-4" />
										{t("nav.admin")}
									</DropdownMenuItem>
								)}
								<DropdownMenuSeparator />
								<DropdownMenuItem variant="destructive" onClick={handleLogout}>
									<LogOut className="h-4 w-4" />
									{t("nav.logout")}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Button variant="ghost" size="sm" render={<Link to="/login" />}>
							<LogIn className="h-4 w-4" />
						</Button>
					)}

					{/* Mobile Hamburger Menu */}
					<Sheet>
						<SheetTrigger render={<Button variant="ghost" size="icon-sm" />}>
							<Menu className="h-5 w-5" />
						</SheetTrigger>
						<SheetContent side="left" className="w-72 bg-background">
							<SheetHeader>
								<SheetTitle className="font-heading text-xl text-stone-900">UniLostItem</SheetTitle>
							</SheetHeader>
							<nav className="mt-6 flex flex-col gap-1">
								{navLinks.map((link) => (
									<Link
										key={link.path}
										to={link.path}
										className={`rounded-md px-3 py-2.5 text-sm font-medium uppercase tracking-[0.08em] transition-colors ${
											isActive(link.path)
												? "bg-stone-100 text-stone-900"
												: "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
										}`}
									>
										{t(link.labelKey)}
									</Link>
								))}
								{isAuthenticated && (
									<>
										<div className="my-2 h-px bg-stone-200" />
										<Link
											to="/items/new"
											className="rounded-md px-3 py-2.5 text-sm font-medium uppercase tracking-[0.08em] text-stone-500 transition-colors hover:bg-stone-50 hover:text-stone-900"
										>
											{t("items.addItem")}
										</Link>
										<Link
											to="/profile"
											className="rounded-md px-3 py-2.5 text-sm font-medium uppercase tracking-[0.08em] text-stone-500 transition-colors hover:bg-stone-50 hover:text-stone-900"
										>
											{t("nav.profile")}
										</Link>
									</>
								)}
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
