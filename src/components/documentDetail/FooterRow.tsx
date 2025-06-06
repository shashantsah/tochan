
import { Hotkey } from "@/components/ui/HotKey";
import { Button } from "@/components/Button";



type ThoughtContextType = {
  showAiEditor: () => void;
  isShowingAiEditorMenu: boolean;
};

interface FooterRowProps {
  thoughtContext: ThoughtContextType;
}

export const FooterRow = ({ thoughtContext }: FooterRowProps) => {
  const { showAiEditor, isShowingAiEditorMenu } = thoughtContext;
  const isMdBreakpoint = true;

  return (
   <div className="pointer-events-none sticky bottom-0 z-10 flex w-full items-center justify-center p-4 md:justify-between">
			<div className="pointer-events-auto">
				<div>
					{!isShowingAiEditorMenu && (
						<Button size="sm" onClick={()=>{}}>
							{isMdBreakpoint && <Hotkey keys={["Command", "O"]} />}
							<span>Chat</span>
						</Button>
					)}
				</div>
			</div>
		</div>
  );
};