'use client';

import { useQuery } from '@tanstack/react-query';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { getMultistepFlows } from '@/lib/api/flows';
import { useUIStore } from '@/store';

interface FlowSelectOverlayProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function FlowSelectOverlay({ open, onOpenChange }: FlowSelectOverlayProps) {
  const setStartFlowId = useUIStore((state) => state.setStartFlowId);

  const { data, isLoading, error } = useQuery({
    queryKey: ['multistep-flows'],
    queryFn: getMultistepFlows,
    enabled: open,
  });

  const handleSelect = (id: string) => {
    setStartFlowId(id);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md flex flex-col">
        <SheetHeader className="border-b pb-4 pt-2">
          <SheetTitle>Select a Flow</SheetTitle>
          <SheetDescription>Choose a flow to start</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-destructive">Failed to load flows</p>}
          {data &&
            Object.entries(data).map(([id, flow]: [string, any]) => (
              <Button key={id} variant="outline" className="w-full justify-start" onClick={() => handleSelect(id)}>
                {flow?.name || flow?.title || id}
              </Button>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
