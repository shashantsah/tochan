import { Tag } from "@/components/Tag";
import { ArrowLeft, ArrowRight, CreditCardIcon, MenuIcon, TimerIcon, XIcon } from "lucide-react";
import { FC } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/Button";
import { Dropdown, DropdownItem } from "@/components/Dropdown";
import { FeedbackDropdown } from "@/components/Feedback";
import { useWorkspaceStore } from "@/stores/workspace";
import { pluralize } from "@/utils/strings";
import { useCustomerStatus } from "@/utils/useCustomerStatus";

import { useSidebarContext } from "./SidebarProvider";

export const Navbar: FC = () => {
	const workspace = useWorkspaceStore();

	const { data } = useCustomerStatus();

	const customerStatus = data?.customerStatus;

	const { isMobileSidebarOpen, setIsMobileSidebarOpen } = useSidebarContext();

	return (
		<nav className="relative z-20 flex w-full flex-row items-center justify-between border-b border-border bg-background px-4 py-4 md:hidden md:justify-end md:py-3">
			<ul className="flex flex-row items-center gap-2 md:hidden">
				<li>
					<Button onClick={() => window.history.back()} aria-label="Go back" variant="ghost" size="icon">
						<ArrowLeft className="size-6" />
					</Button>
				</li>
				<li>
					<Button onClick={() => window.history.forward()} aria-label="Go forward" variant="ghost" size="icon">
						<ArrowRight className="size-6" />
					</Button>
				</li>
			</ul>
			<div className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 md:hidden">
				<img src="/logo.png" className="w-10" alt="Logo" />
				<div className="absolute -right-10 top-1/2 -translate-y-1/2 scale-75">
					<Tag className="text-accent/80">beta</Tag>
				</div>
			</div>
			<div className="flex flex-row items-center gap-2">
				<div className="hidden md:block">
					{customerStatus?.isTrialing && (
						<Dropdown
							trigger={
								<div className="flex cursor-pointer flex-row items-center gap-1 rounded bg-card px-2 py-1 text-secondary hover:bg-accent/20">
									<TimerIcon className="h-3.5 w-3.5" />
									<span className="text-xs">
										{`${pluralize(customerStatus.remainingDaysInTrial ?? 0, "day")} remaining in trial`}
									</span>
								</div>
							}>
							{/* <Link to={`/workspaces/${workspace?.slug}/settings`}> */}
								<DropdownItem className="text-accent">
									<CreditCardIcon className="size-4" />
									<span>Manage subscription</span>
								</DropdownItem>
							{/* </Link> */}
						</Dropdown>
					)}
				</div>
				<FeedbackDropdown />
				{!isMobileSidebarOpen ? (
					<Button aria-label="Menu" variant="ghost" size="icon" onClick={() => setIsMobileSidebarOpen(true)}>
						<MenuIcon className="size-6" />
					</Button>
				) : (
					<Button aria-label="Menu" variant="ghost" size="icon" onClick={() => setIsMobileSidebarOpen(false)}>
						<XIcon className="size-6" />
					</Button>
				)}
			</div>
		</nav>
	);
};
