import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface PageFrame {
  page: number | null;
  lastUsed?: number;
  frequency?: number;
}

interface SimulationStep {
  pageRequest: number;
  frames: PageFrame[];
  pageFault: boolean;
  replacedPage?: number;
  algorithm?: string;
}

const PageReplacement = () => {
  const [algorithm, setAlgorithm] = useState<'FIFO' | 'Optimal' | 'LRU' | 'LFU'>('FIFO');
  const [frameCount, setFrameCount] = useState(3);
  const [pageSequence, setPageSequence] = useState('1,2,3,4,1,2,5,1,2,3,4,5');
  const [simulation, setSimulation] = useState<SimulationStep[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const runSimulation = () => {
    const pages = pageSequence.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
    if (pages.length === 0 || frameCount < 1) return;

    const frames: PageFrame[] = Array(frameCount).fill(null).map(() => ({ page: null }));
    const steps: SimulationStep[] = [];
    let time = 0;

    for (const page of pages) {
      time++;
      const frameIndex = frames.findIndex(f => f.page === page);
      let pageFault = false;
      let replacedPage: number | undefined;

      if (frameIndex === -1) {
        // Page fault
        pageFault = true;
        let replaceIndex = -1;

        // Find empty frame first
        const emptyIndex = frames.findIndex(f => f.page === null);
        if (emptyIndex !== -1) {
          replaceIndex = emptyIndex;
        } else {
          // Apply replacement algorithm
          switch (algorithm) {
            case 'FIFO':
              replaceIndex = frames.findIndex(f => f.lastUsed === Math.min(...frames.map(f => f.lastUsed || 0)));
              break;
            case 'LRU':
              replaceIndex = frames.findIndex(f => f.lastUsed === Math.min(...frames.map(f => f.lastUsed || 0)));
              break;
            case 'LFU':
              const minFreq = Math.min(...frames.map(f => f.frequency || 0));
              replaceIndex = frames.findIndex(f => f.frequency === minFreq);
              break;
            case 'Optimal':
              // Look ahead to find page that will be used farthest in future
              const futureUses = frames.map(f => {
                const futureIndex = pages.findIndex((p, i) => i > pages.indexOf(page) && p === f.page);
                return futureIndex === -1 ? Infinity : futureIndex;
              });
              replaceIndex = futureUses.indexOf(Math.max(...futureUses));
              break;
          }
        }

        if (frames[replaceIndex].page !== null) {
          replacedPage = frames[replaceIndex].page;
        }

        frames[replaceIndex] = {
          page,
          lastUsed: time,
          frequency: 1
        };
      } else {
        // Page hit - update access info
        frames[frameIndex].lastUsed = time;
        frames[frameIndex].frequency = (frames[frameIndex].frequency || 0) + 1;
      }

      steps.push({
        pageRequest: page,
        frames: frames.map(f => ({ ...f })),
        pageFault,
        replacedPage,
        algorithm
      });
    }

    setSimulation(steps);
    setCurrentStep(0);
  };

  const simulateStep = async () => {
    if (currentStep >= simulation.length) return;
    
    setIsSimulating(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setCurrentStep(prev => prev + 1);
    setIsSimulating(false);
  };

  const resetSimulation = () => {
    setSimulation([]);
    setCurrentStep(0);
    setIsSimulating(false);
  };

  const pageFaults = simulation.slice(0, currentStep).filter(s => s.pageFault).length;
  const pageHits = currentStep - pageFaults;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">Page Replacement Algorithms</h1>
        <p className="text-muted-foreground">
          Simulate various page replacement strategies and analyze their performance
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="algorithm">Algorithm</Label>
              <Select value={algorithm} onValueChange={(value: any) => setAlgorithm(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIFO">FIFO (First In First Out)</SelectItem>
                  <SelectItem value="LRU">LRU (Least Recently Used)</SelectItem>
                  <SelectItem value="LFU">LFU (Least Frequently Used)</SelectItem>
                  <SelectItem value="Optimal">Optimal (Belady's Algorithm)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frames">Number of Frames</Label>
              <Input
                id="frames"
                type="number"
                min="1"
                max="10"
                value={frameCount}
                onChange={(e) => setFrameCount(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sequence">Page Reference String</Label>
              <Input
                id="sequence"
                placeholder="1,2,3,4,1,2,5"
                value={pageSequence}
                onChange={(e) => setPageSequence(e.target.value)}
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button onClick={runSimulation}>
              Generate Simulation
            </Button>
            {simulation.length > 0 && (
              <>
                <Button 
                  onClick={simulateStep} 
                  disabled={isSimulating || currentStep >= simulation.length}
                >
                  Next Step
                </Button>
                <Button variant="outline" onClick={resetSimulation}>
                  Reset
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {simulation.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Memory Frames</CardTitle>
              <CardDescription>
                Current state of memory frames (Step {currentStep} of {simulation.length})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Current Frames */}
                <div className="grid grid-cols-1 gap-2">
                  {Array.from({ length: frameCount }).map((_, frameIndex) => (
                    <div key={frameIndex} className="flex items-center space-x-2">
                      <div className="w-16 text-sm text-muted-foreground">
                        Frame {frameIndex}:
                      </div>
                      <div className="flex-1 grid grid-cols-10 gap-1">
                        {simulation.slice(0, currentStep).map((step, stepIndex) => {
                          const frame = step.frames[frameIndex];
                          const isNewPage = step.pageFault && frame.page === step.pageRequest;
                          const wasReplaced = step.replacedPage !== undefined && 
                            stepIndex > 0 && 
                            simulation[stepIndex - 1].frames[frameIndex].page === step.replacedPage;
                          
                          return (
                            <div
                              key={stepIndex}
                              className={`h-8 border rounded flex items-center justify-center text-xs font-mono ${
                                isNewPage ? 'bg-green-500/20 border-green-500' :
                                wasReplaced ? 'bg-red-500/20 border-red-500' :
                                frame.page ? 'bg-muted border-border' : 'bg-background border-dashed border-muted-foreground/30'
                              }`}
                            >
                              {frame.page || ''}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Page Requests */}
                <div className="flex items-center space-x-2">
                  <div className="w-16 text-sm text-muted-foreground">
                    Requests:
                  </div>
                  <div className="flex-1 grid grid-cols-10 gap-1">
                    {simulation.slice(0, currentStep).map((step, stepIndex) => (
                      <div
                        key={stepIndex}
                        className={`h-8 border rounded flex items-center justify-center text-xs font-mono ${
                          step.pageFault ? 'bg-red-500/20 border-red-500' : 'bg-green-500/20 border-green-500'
                        }`}
                      >
                        {step.pageRequest}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Page Fault Indicator */}
                <div className="flex items-center space-x-2">
                  <div className="w-16 text-sm text-muted-foreground">
                    Result:
                  </div>
                  <div className="flex-1 grid grid-cols-10 gap-1">
                    {simulation.slice(0, currentStep).map((step, stepIndex) => (
                      <div
                        key={stepIndex}
                        className="h-8 flex items-center justify-center text-xs"
                      >
                        <Badge 
                          variant={step.pageFault ? "destructive" : "default"}
                          className="text-xs px-1 py-0"
                        >
                          {step.pageFault ? 'F' : 'H'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Algorithm:</span>
                  <Badge variant="outline">{algorithm}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Total Steps:</span>
                  <Badge>{currentStep}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Page Faults:</span>
                  <Badge variant="destructive">{pageFaults}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Page Hits:</span>
                  <Badge variant="default">{pageHits}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Fault Rate:</span>
                  <Badge variant="outline">
                    {currentStep > 0 ? ((pageFaults / currentStep) * 100).toFixed(1) : 0}%
                  </Badge>
                </div>
              </div>

              {currentStep > 0 && currentStep <= simulation.length && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium">Current Step Info:</h4>
                    <div className="text-sm space-y-1">
                      <div>Page Request: <Badge variant="outline">{simulation[currentStep - 1]?.pageRequest}</Badge></div>
                      <div>
                        Result: <Badge variant={simulation[currentStep - 1]?.pageFault ? "destructive" : "default"}>
                          {simulation[currentStep - 1]?.pageFault ? 'Page Fault' : 'Page Hit'}
                        </Badge>
                      </div>
                      {simulation[currentStep - 1]?.replacedPage && (
                        <div>Replaced Page: <Badge variant="secondary">{simulation[currentStep - 1].replacedPage}</Badge></div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Algorithm Descriptions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">FIFO</h4>
              <p className="text-sm text-muted-foreground">
                Replaces the oldest page in memory. Simple but may not be optimal.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">LRU</h4>
              <p className="text-sm text-muted-foreground">
                Replaces the page that hasn't been used for the longest time.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">LFU</h4>
              <p className="text-sm text-muted-foreground">
                Replaces the page that has been used least frequently.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Optimal</h4>
              <p className="text-sm text-muted-foreground">
                Replaces the page that will be used farthest in the future. Theoretical optimum.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageReplacement;