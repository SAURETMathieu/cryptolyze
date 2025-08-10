"use client";

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
import { useOrderStore } from "@/src/store/admin/order.store";
import { useGlobalStore } from "@/src/store/global.store";
import ReactJsonView from "@microlink/react-json-view";
import {
  Bug,
  FileBox,
  FileCheck,
  Globe,
  Receipt,
  Save,
  Undo,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import CopyButton from "@/components/buttons/CopyButton";
import { Button } from "@/components/ui/button";

interface DevStoresModalProps {
  title?: string;
  icon?: React.ReactNode;
  collapseDepth?: number | boolean;
  className?: string;
  disabled?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

export default function DevStoresModal({
  title = "Stores",
  icon,
  collapseDepth = false,
  className,
  disabled,
  canEdit = true,
  canDelete = true,
}: DevStoresModalProps) {
  const globalStore = useGlobalStore();
  // ADMIN STORES
  const orderAdminStore = useOrderStore();
  //TODO add test default datas for stores with all cases ( button to click to initialize stores datas)

  const stores = useMemo(
    () => [
      {
        name: "Global",
        datas: globalStore,
        onSave: (newDatas: any) => {
          console.log("Saving Global Store data:", newDatas);
          toast.success("Global Store data saved");
          globalStore.setStore(newDatas);
        },
        isFetchedKeys: ["userInfosLoaded"] as Array<keyof typeof globalStore>,
        icon: <Globe size={16} />,
      },
      {
        name: "Order",
        datas: orderAdminStore,
        onSave: (newDatas: any) => {
          console.log("Saving Order Store data:", newDatas);
          toast.success("Order Store data saved");
          orderAdminStore.setStore(newDatas);
        },
        isFetchedKeys: [
          "ordersByStatusFetched",
          "currentOrderFetched",
        ] as Array<keyof typeof orderAdminStore>,
        icon: <FileBox size={16} />,
      },
    ],
    [globalStore, orderAdminStore],
  );

  const [actionsHistory, setActionsHistory] = useState<any[]>([
    stores[0].datas,
  ]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [currentStore, setCurrentStore] = useState<any>(stores[0]?.datas);
  const [open, setOpen] = useState(false);
  const [selectedStoreIndex, setSelectedStoreIndex] = useState<number>(0);

  // Handle selecting a store
  const handleStoreSelection = (index: number) => {
    if (actionsHistory?.length > 1) {
      toast.error(
        "Please save or cancel your changes before switching to another store",
      );
      return;
    }
    setSelectedStoreIndex(index);
    setCurrentStore(stores[index].datas);
    setActionsHistory([stores[index].datas]);
    setRedoStack([]);
  };

  const handleAddAction = (action: any) => {
    setActionsHistory([...actionsHistory, action]);
    console.log("actionsHistory", actionsHistory);
    setRedoStack([]);
    setCurrentStore(action);
  };

  const handleUndoLastAction = () => {
    if (actionsHistory.length > 1) {
      const previousState = actionsHistory[actionsHistory.length - 2];
      setRedoStack([currentStore, ...redoStack]);
      setActionsHistory(actionsHistory.slice(0, -1));
      setCurrentStore(previousState);
    }
  };

  const handleRedoLastAction = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setRedoStack(redoStack.slice(1));
      setActionsHistory([...actionsHistory, nextState]);
      setCurrentStore(nextState);
    }
  };

  const handleSave = () => {
    stores[selectedStoreIndex].onSave(currentStore);
    toast.success("Saved");
  };

  useEffect(() => {
    setActionsHistory([stores[selectedStoreIndex].datas]);
    setRedoStack([]);
    setCurrentStore(stores[selectedStoreIndex].datas);
  }, [selectedStoreIndex, stores]);

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
          }}
          disabled={disabled}
          className={cn(
            "hover:bg-muted absolute left-0 top-0 size-5 rounded-none hover:ring-0",
            className,
          )}
        >
          <Bug size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] min-h-[500px] w-fit min-w-[340px] max-w-[85vw] resize flex-col gap-0 overflow-auto p-0">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-border mb-1 border-b px-6 py-4">
            {icon && <span className="mr-2">{icon}</span>}
            {title}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex min-w-[50vw] flex-1 overflow-y-auto">
          <div className="relative flex-1 overflow-y-auto">
            <CopyButton
              toCopy={JSON.stringify(currentStore, null, 2)}
              className="dark:border-muted-foreground  fixed right-[270px] top-[4.5rem] z-[100]"
            />
            <DialogDescription className="text-primary p-6" asChild>
              <ReactJsonView
                src={currentStore}
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
                  borderRadius: "5px",
                  padding: "1.5rem",
                  lineHeight: "0.9rem",
                  fontSize: "0.85rem",
                  marginRight: ".3rem",
                  marginLeft: ".8rem",
                }}
                displayDataTypes={false}
                name={false}
                displayObjectSize={false}
                collapsed={collapseDepth}
                shouldCollapse={(field) => field.name === "control"}
              />
            </DialogDescription>
          </div>
          <div className="max-h-[500px] w-[250px] overflow-y-auto p-4">
            <div className="space-y-2">
              {stores.map((store, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleStoreSelection(index)}
                  className={cn(
                    "w-full text-left",
                    selectedStoreIndex === index &&
                      "bg-primary text-primary-foreground",
                  )}
                >
                  <div className="relative flex w-full items-center justify-start gap-4">
                    {store.icon && <span>{store.icon}</span>}
                    <span>{store.name}</span>
                    {store.isFetchedKeys.map((key, index) => (
                      <span
                        key={key as string}
                        title={key as string}
                        className={cn(
                          "absolute block rounded-full bg-red-500 p-1",
                          (store.datas as any)[key] && "bg-green-600",
                        )}
                        style={{ right: `${index * 16}px` }}
                      ></span>
                    ))}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
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
