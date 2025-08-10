"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { cn } from "@/src/lib/utils";
import ReactJsonView from "@microlink/react-json-view";
import { Braces, Save, Undo } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import CopyButton from "@/components/buttons/CopyButton";

interface DevModalProps {
  datas: any;
  title?: string;
  onSave?: (newDatas: any) => void;
  collapseDepth?: number | boolean;
  className?: string;
  disabled?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

export default function DevModal({
  datas,
  title = "Détails de la ligne",
  onSave = (newDatas) => console.log(newDatas),
  collapseDepth = false,
  className,
  disabled,
  canEdit = true,
  canDelete = true,
}: DevModalProps) {
  const [actionsHistory, setActionsHistory] = useState<any[]>([datas]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [currentRow, setCurrentRow] = useState<any>(datas);
  const [open, setOpen] = useState(false);

  const handleAddAction = (action: any) => {
    setActionsHistory([...actionsHistory, action]);
    setRedoStack([]);
    setCurrentRow(action);
  };

  const handleUndoLastAction = () => {
    if (actionsHistory.length > 1) {
      const previousState = actionsHistory[actionsHistory.length - 2];
      setRedoStack([currentRow, ...redoStack]);
      setActionsHistory(actionsHistory.slice(0, -1));
      setCurrentRow(previousState);
    }
  };

  const handleRedoLastAction = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setRedoStack(redoStack.slice(1));
      setActionsHistory([...actionsHistory, nextState]);
      setCurrentRow(nextState);
    }
  };

  const handleSave = () => {
    onSave(currentRow);
    setActionsHistory([currentRow]);
    setRedoStack([]);
    toast.success("Saved");
  };

  useEffect(() => {
    if (!open) {
      setActionsHistory([datas]);
      setRedoStack([]);
      setCurrentRow(datas);
    }
  }, [open, datas]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key.toLowerCase() === "z") {
          event.preventDefault();
          handleUndoLastAction();
        } else if (event.key.toLowerCase() === "y") {
          event.preventDefault();
          handleRedoLastAction();
        } else if (event.key.toLowerCase() === "s") {
          event.preventDefault();
          handleSave();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionsHistory, redoStack]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            console.log(datas);
          }}
          disabled={disabled}
          className={cn(
            "hover:bg-muted absolute left-0 top-0 size-5 rounded-none hover:ring-0",
            className
          )}
        >
          <Braces size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] min-h-[500px] w-fit min-w-[340px] max-w-[85vw] resize flex-col gap-0 overflow-auto p-0">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-border mb-1 border-b px-6 py-4">
            {title}
          </DialogTitle>
          <DialogDescription></DialogDescription>
          <div className="overflow-y-auto">
            <CopyButton
              toCopy={JSON.stringify(currentRow, null, 2)}
              className="dark:border-muted-foreground fixed right-4 top-[4.5rem] z-[100]"
            />
            <DialogDescription className="text-primary p-6" asChild>
              <ReactJsonView
                src={currentRow}
                theme={"google"}
                onEdit={
                  canEdit
                    ? (edited) => handleAddAction(edited.updated_src)
                    : false
                }
                onDelete={
                  canDelete
                    ? (deleted) => handleAddAction(deleted.updated_src)
                    : false
                }
                style={{
                  minHeight: "500px",
                  minWidth: "50vw",
                  borderRadius: "5px",
                  padding: "1.5rem",
                  lineHeight: "0.9rem",
                  fontSize: "0.85rem",
                }}
                displayDataTypes={false}
                name={false}
                displayObjectSize={false}
                collapsed={collapseDepth}
                shouldCollapse={(field) => field.name === "control"}
              />
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="border-border mt-1 border-t px-6 py-4">
          <div className="mr-auto flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleUndoLastAction}
              disabled={actionsHistory.length < 2}
            >
              <Undo size={18} className="mr-2" />
              Retour
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleRedoLastAction}
              disabled={redoStack.length === 0}
            >
              <Undo size={18} className="mr-2 rotate-180" />
              Avancer
            </Button>
            <Button
              type="button"
              variant="green"
              onClick={handleSave}
              disabled={actionsHistory.length < 2}
            >
              <Save size={18} className="mr-2" />
              Save{" "}
              {actionsHistory.length > 1 && `(${actionsHistory.length - 1})`}
            </Button>
          </div>
          <DialogClose asChild>
            <Button type="button">Fermer</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
