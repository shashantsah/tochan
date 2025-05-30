"use client";
import { EditorView } from "@/components/documentDetail/EditorView";
// import {
// 	ArrowLeftIcon,
// 	ChevronsLeftIcon,
// 	ChevronsRightIcon,
// 	CircleFadingArrowUp,
// 	FilePlusIcon,
// 	HomeIcon,
// 	PanelLeftCloseIcon,
// 	SearchIcon,
// } from "lucide-react";
// import { useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";

import { MobileTabBar } from "@/components/MobileTabBar";
import { Navbar } from "@/components/Navbar";
import SidebarView from "@/components/SidebarView";

// import { Button } from "@/components/Button";
// import { FeedbackDropdown } from "@/components/Feedback";
// import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip";
// // import { useUserRecord } from "@/stores/user";
// import { useWorkspaceStore } from "@/stores/workspace";
// import { cn } from "@/utils";
// import { useDebug } from "@/utils/debug";
// import { pluralize } from "@/utils/strings";
// import { useBreakpoint } from "@/utils/tailwind";
// // import { useCustomerStatus } from "@/utils/useCustomerStatus";

// // import { useProject } from "@/components/projects/ProjectContext";
// // import { useSearchBarStore } from "../search/searchBarStore";
// // import { GenerateDoc } from "./GenerateDoc";
// // import { LibraryView } from "./LibraryView";
// // import { NewNote } from "./NewNote";
// // import { PendingPullRequests } from "./PendingPullRequests";
// // import { ProjectSelector } from "./ProjectSelector";
// // import { ProjectsList } from "./ProjectsList";
// // import { SidebarDropdown } from "./SidebarDropdown";
// import { useSidebarContext } from "@/components/SidebarProvider";
// import { WorkspaceSelector } from "@/components/WorkspaceSelector";


// const minimalSidebarRoutePaths = ["/workspaces/new/setup", "/auth/invite-accept", "/auth/complete-account-setup"];

// export default function SidebarView() {
// 	const debug = useDebug();
// 	const isMdBreakpoint = useBreakpoint("md");
// 	const isMobile = !isMdBreakpoint;

// 	const userRecord = useUserRecord();
// 	const workspace = useWorkspaceStore();
// 	// const { setIsOpen: setIsSearchBarOpen } = useSearchBarStore();
// 	// const project = useProject();

// 	const { data } = useCustomerStatus();
// 	const customerStatus = data?.customerStatus;

// 	const location = useLocation();
// 	const isMinimalSidebar = minimalSidebarRoutePaths.includes(location.pathname);

// 	const { isSidebarCollapsed, setIsSidebarCollapsed, isMobileSidebarOpen, isSidebarFixed } = useSidebarContext();

// 	// useEffect(() => {
// 	// 	const handleEscPress = (e: KeyboardEvent) => {
// 	// 		if (e.key === "Escape" && isSidebarFixed) {
// 	// 			setIsSidebarCollapsed(true);
// 	// 		}
// 	// 	};

// 	// 	window.addEventListener("keydown", handleEscPress);
// 	// 	return () => window.removeEventListener("keydown", handleEscPress);
// 	// }, [isSidebarFixed, setIsSidebarCollapsed]);

// 	// if (isMobile && !isMobileSidebarOpen) {
// 	// 	return null;
// 	// }

// 	return (
// 		<div className={cn("relative h-full md:h-dvh md:w-64", isSidebarFixed && "transition-transform duration-200 md:w-0")}>
// 			<div
// 				className={cn(
// 					"absolute top-0 z-50 flex h-full w-screen flex-col overflow-hidden border-r border-border bg-background py-2 pt-4 transition-transform duration-200 ease-in-out md:sticky md:h-dvh md:w-64 md:pt-2",
// 					isSidebarFixed && "md:absolute",
// 					isSidebarFixed && isSidebarCollapsed ? "-translate-x-full" : "translate-x-0",
// 				)}>
// 				{isSidebarFixed && (
// 					<div className="border-b border-border px-4 pb-2">
// 						<Button variant="ghost" size="icon-sm" onClick={() => setIsSidebarCollapsed(true)}>
// 							<PanelLeftCloseIcon className="size-5" />
// 						</Button>
// 					</div>
// 				)}
// 				<WorkspaceSelector />
// 				{project && (
// 					<div className="mb-4">
// 						<ProjectSelector />
// 					</div>
// 				)}
// 				{workspace && (
// 					<>
// 						<div className="flex items-center gap-1 px-4">
// 							<NewNote />
// 							<GenerateDoc />
// 						</div>
// 						<div className="no-scrollbar mt-4 flex flex-1 flex-col gap-4 overflow-y-auto px-4">
// 							<Button
// 								variant="secondary"
// 								className="w-full justify-start border border-border text-sm font-medium text-secondary hover:bg-card/50 hover:text-secondary"
// 								onClick={() => setIsSearchBarOpen(true)}>
// 								<SearchIcon className="size-4" />
// 								<span>Search</span>
// 							</Button>
// 							{!project && <ProjectsList />}
// 							<LibraryView />
// 							{/* <LatestThoughts /> */}
// 							{/* <Collections /> */}
// 							{project && <PendingPullRequests />}
// 							<div className="h-4" />
// 						</div>
// 					</>
// 				)}
// 				{debug && <div className="mb-4 px-4 text-xs text-secondary">Debug is enabled</div>}
// 				<div className="flex w-full flex-col gap-2 px-4 py-2">
// 					<div className="hidden w-full flex-col items-stretch md:flex">
// 						<FeedbackDropdown />
// 					</div>
// 					{customerStatus?.isTrialing && (
// 						<div className="flex flex-row items-center justify-between rounded bg-card px-3 py-2">
// 							<div className="flex flex-col">
// 								<span className="text-sm font-medium text-secondary">Trial Status</span>
// 								<span className="text-sm">
// 									{`${pluralize(customerStatus.remainingDaysInTrial ?? 0, "day")} remaining`}
// 								</span>
// 							</div>
// 							<Tooltip>
// 								<TooltipTrigger>
// 									<Link to={`/workspaces/${workspace?.slug}/settings`}>
// 										<Button variant="ghost" size="icon-sm" className="text-accent">
// 											<CircleFadingArrowUp className="size-5" />
// 										</Button>
// 									</Link>
// 								</TooltipTrigger>
// 								<TooltipContent>Upgrade plan</TooltipContent>
// 							</Tooltip>
// 						</div>
// 					)}
// 				</div>
// 				<div className="flex w-full flex-row items-center justify-between border-t border-border px-4 pb-2 pt-3">
// 					{userRecord && (
// 						<div className="flex flex-col">
// 							<span className="text-sm font-medium text-secondary">Signed in as</span>
// 							<span className="text-sm">{userRecord.email}</span>
// 						</div>
// 					)}
// 					<SidebarDropdown />
// 				</div>
// 			</div>
// 			{isSidebarFixed && (
// 				<div
// 					className={cn(
// 						"absolute bottom-0 left-0 right-0 top-0 z-40 h-screen w-screen bg-black/5 backdrop-blur-sm transition-opacity duration-200 ease-in-out",
// 						isSidebarCollapsed ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100",
// 					)}
// 					onClick={() => setIsSidebarCollapsed(true)}
// 				/>
// 			)}
// 		</div>
// 	);
// };


export default function SidebarLayout({ children }: { children: React.ReactNode }){
	return (
		<>
			<Navbar />
			<div className="flex flex-1 flex-row overflow-hidden">
				<main className="flex h-full w-full flex-col overflow-hidden md:h-screen md:w-auto md:flex-1 md:overflow-hidden">
					{children}
				</main>
			</div>
			{/* <MobileTabBar /> */}
			{/* <SearchBarControl /> */}
			{/* <PaymentSuccessDialog /> */}
		</>
	);
};
