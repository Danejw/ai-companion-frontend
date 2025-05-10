import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Phq4Questionnaire, QuestionnaireResponses } from "@/components/Phq4Questionaire";
import { QuestionnaireStage } from "@/store";



// Overlay component that adapts for pre and post
export default function Phq4Overlay({ isOpen, stage, onClose, onSubmit }: { isOpen: boolean, stage: QuestionnaireStage, onClose: () => void, onSubmit: (responses: QuestionnaireResponses) => void }) {
    return (
      <Dialog open={isOpen} onOpenChange={open => { if (!open) onClose(); }}>
        <DialogContent
            className="max-w-sm sm:max-w-lg md:max-w-xl p-3 sm:p-4 overflow-y-auto scrollbar-hide w-[95vw] max-h-[90vh] sm:max-h-[85vh] !top-[10%] !translate-y-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ maxHeight: "90vh" }}
        >
          <div className="p-6 overflow-y-auto scrollbar-hide" style={{ maxHeight: "80vh" }}>
            <Phq4Questionnaire stage={stage} onSubmit={onSubmit} onClose={onClose} />
          </div>
        </DialogContent>
      </Dialog>
    );
  }