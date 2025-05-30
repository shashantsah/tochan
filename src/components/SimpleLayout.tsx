import { cn } from "@/utils";

import LoadingSpinner from "./LoadingSpinner";

export const SimpleLayout = ({
	children,
	isLoading,
	className,
}: {
	children: React.ReactNode;
	isLoading?: boolean;
	className?: string;
}) => {
	return (
		<div className={cn("no-scrollbar box-border flex flex-1 flex-col overflow-y-scroll px-6 md:px-16 lg:px-20", className)}>
			{isLoading ? (
				<div className="flex h-[calc(100vh-20rem)] flex-col items-center justify-center">
					<LoadingSpinner />
				</div>
			) : (
				children
			)}
		</div>
	);
};

export const SimpleLayoutView = ({ children, className }: { children: React.ReactNode; className?: string }) => {
	return <div className={cn("flex flex-col bg-background", className)}>{children}</div>;
};

SimpleLayout.View = SimpleLayoutView;
