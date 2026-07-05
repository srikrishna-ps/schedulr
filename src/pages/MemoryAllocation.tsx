import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MemoryStick, RotateCcw, Play } from 'lucide-react';

type Algorithm = 'FirstFit' | 'BestFit' | 'WorstFit';

interface Allocation {
  processIndex: number;
  processSize: number;
  blockIndex: number | null;
  fragmentation: number;
}

interface SimResult {
  algorithm: Algorithm;
  blocks: number[];
  allocations: Allocation[];
  blockOccupant: (number | null)[];
}

const PROCESS_COLORS = [
  '#22c55e', '#3b82f6', '#f59e0b', '#ef4444',
  '#a855f7', '#06b6d4', '#ec4899', '#84cc16',
];

const ALGORITHM_INFO: Record<Algorithm, string> = {
  FirstFit: 'Scans memory from the beginning and places the process in the first block large enough. Fast, but leaves scattered holes near the start of memory.',
  BestFit: 'Places the process in the smallest block that fits. Minimizes leftover space per allocation, but creates many tiny unusable holes.',
  WorstFit: 'Places the process in the largest available block. Leaves the biggest possible leftover hole, hoping it stays useful for future processes.',
};

const MemoryAllocation = () => {
  const [algorithm, setAlgorithm] = useState<Algorithm>('FirstFit');
  const [blocksInput, setBlocksInput] = useState('100,500,200,300,600');
  const [processesInput, setProcessesInput] = useState('212,417,112,426');
  const [result, setResult] = useState<SimResult | null>(null);
  const [inputsLocked, setInputsLocked] = useState(false);

  const parseList = (text: string) =>
    text.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0);

  const runSimulation = () => {
    const blocks = parseList(blocksInput);
    const processes = parseList(processesInput);
    if (blocks.length === 0 || processes.length === 0) return;

    setInputsLocked(true);
    const blockOccupant: (number | null)[] = blocks.map(() => null);

    const allocations: Allocation[] = processes.map((size, processIndex) => {
      let chosen = -1;
      blocks.forEach((blockSize, blockIndex) => {
        if (blockOccupant[blockIndex] !== null || blockSize < size) return;
        if (chosen === -1) {
          chosen = blockIndex;
        } else if (algorithm === 'BestFit' && blockSize < blocks[chosen]) {
          chosen = blockIndex;
        } else if (algorithm === 'WorstFit' && blockSize > blocks[chosen]) {
          chosen = blockIndex;
        }
        // FirstFit keeps the first block found
      });

      if (chosen === -1) {
        return { processIndex, processSize: size, blockIndex: null, fragmentation: 0 };
      }
      blockOccupant[chosen] = processIndex;
      return {
        processIndex,
        processSize: size,
        blockIndex: chosen,
        fragmentation: blocks[chosen] - size,
      };
    });

    setResult({ algorithm, blocks, allocations, blockOccupant });
  };

  const reset = () => {
    setResult(null);
    setInputsLocked(false);
  };

  const totalMemory = result ? result.blocks.reduce((a, b) => a + b, 0) : 0;
  const allocated = result ? result.allocations.filter(a => a.blockIndex !== null) : [];
  const unallocated = result ? result.allocations.filter(a => a.blockIndex === null) : [];
  const totalFragmentation = allocated.reduce((sum, a) => sum + a.fragmentation, 0);
  const usedMemory = allocated.reduce((sum, a) => sum + a.processSize, 0);
  const maxBlock = result ? Math.max(...result.blocks) : 1;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Card className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-primary/30 mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl">
            <div className="p-2 bg-primary/20 rounded-lg">
              <MemoryStick className="w-8 h-8 text-primary" />
            </div>
            Memory Allocation Simulator
          </CardTitle>
          <p className="text-muted-foreground text-lg">
            Simulate contiguous memory allocation with First Fit, Best Fit, and Worst Fit strategies, and analyze fragmentation.
          </p>
        </CardHeader>
      </Card>

      <Card className="group border border-border/60 shadow-md bg-background/90 backdrop-blur-md transition-all duration-150 will-change-transform hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.025] hover:border-primary focus-within:border-primary">
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="algorithm">Allocation Strategy</Label>
              <Select value={algorithm} onValueChange={(value: Algorithm) => setAlgorithm(value)} disabled={inputsLocked}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FirstFit">First Fit</SelectItem>
                  <SelectItem value="BestFit">Best Fit</SelectItem>
                  <SelectItem value="WorstFit">Worst Fit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="blocks">Memory Block Sizes (KB)</Label>
              <Input
                id="blocks"
                value={blocksInput}
                onChange={(e) => setBlocksInput(e.target.value)}
                placeholder="100,500,200,300,600"
                disabled={inputsLocked}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="processes">Process Sizes (KB)</Label>
              <Input
                id="processes"
                value={processesInput}
                onChange={(e) => setProcessesInput(e.target.value)}
                placeholder="212,417,112,426"
                disabled={inputsLocked}
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm text-muted-foreground">
            {ALGORITHM_INFO[algorithm]}
          </div>

          <div className="flex gap-3">
            <Button onClick={runSimulation} disabled={inputsLocked} className="gap-2">
              <Play className="w-4 h-4" />
              Run Allocation
            </Button>
            <Button onClick={reset} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card className="border border-border/60 shadow-md bg-background/90 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Memory Layout</CardTitle>
              <p className="text-sm text-muted-foreground">
                Bar widths are proportional to block size. The colored segment is the allocated process; the hatched
                remainder is internal fragmentation (wasted space inside the block).
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.blocks.map((blockSize, blockIndex) => {
                const occupant = result.blockOccupant[blockIndex];
                const allocation = occupant !== null
                  ? result.allocations.find(a => a.processIndex === occupant)
                  : undefined;
                const fillPercent = allocation ? (allocation.processSize / blockSize) * 100 : 0;
                return (
                  <div key={blockIndex} className="flex items-center gap-4">
                    <div className="w-32 shrink-0 text-sm">
                      <span className="font-medium">Block {blockIndex + 1}</span>
                      <span className="text-muted-foreground"> · {blockSize} KB</span>
                    </div>
                    <div
                      className="h-10 rounded-md border border-border/60 overflow-hidden flex bg-muted/20"
                      style={{ width: `${(blockSize / maxBlock) * 100}%`, minWidth: '80px' }}
                    >
                      {allocation ? (
                        <>
                          <div
                            className="h-full flex items-center justify-center text-xs font-semibold text-black/80"
                            style={{
                              width: `${fillPercent}%`,
                              backgroundColor: PROCESS_COLORS[allocation.processIndex % PROCESS_COLORS.length],
                            }}
                          >
                            P{allocation.processIndex + 1} ({allocation.processSize})
                          </div>
                          {allocation.fragmentation > 0 && (
                            <div
                              className="h-full flex-1 flex items-center justify-center text-[10px] text-muted-foreground"
                              style={{
                                backgroundImage:
                                  'repeating-linear-gradient(45deg, transparent, transparent 4px, hsl(var(--border)) 4px, hsl(var(--border)) 5px)',
                              }}
                            >
                              {allocation.fragmentation} KB wasted
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                          free
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-border/60 shadow-md bg-background/90 backdrop-blur-md">
              <CardHeader>
                <CardTitle>Allocation Table</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-left text-muted-foreground">
                      <th className="py-2 pr-4">Process</th>
                      <th className="py-2 pr-4">Size (KB)</th>
                      <th className="py-2 pr-4">Placed In</th>
                      <th className="py-2">Internal Frag. (KB)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.allocations.map((a) => (
                      <tr key={a.processIndex} className="border-b border-border/30">
                        <td className="py-2 pr-4">
                          <span className="inline-flex items-center gap-2 font-medium">
                            <span
                              className="w-3 h-3 rounded-sm inline-block"
                              style={{ backgroundColor: PROCESS_COLORS[a.processIndex % PROCESS_COLORS.length] }}
                            />
                            P{a.processIndex + 1}
                          </span>
                        </td>
                        <td className="py-2 pr-4">{a.processSize}</td>
                        <td className="py-2 pr-4">
                          {a.blockIndex !== null ? (
                            `Block ${a.blockIndex + 1} (${result.blocks[a.blockIndex]} KB)`
                          ) : (
                            <Badge variant="destructive">Not allocated</Badge>
                          )}
                        </td>
                        <td className="py-2">{a.blockIndex !== null ? a.fragmentation : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <Card className="border border-border/60 shadow-md bg-background/90 backdrop-blur-md">
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Processes Allocated</div>
                    <div className="text-2xl font-bold text-primary">
                      {allocated.length} / {result.allocations.length}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Memory Utilization</div>
                    <div className="text-2xl font-bold text-primary">
                      {totalMemory > 0 ? ((usedMemory / totalMemory) * 100).toFixed(1) : 0}%
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Internal Fragmentation</div>
                    <div className="text-2xl font-bold">{totalFragmentation} KB</div>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Unallocated Processes</div>
                    <div className="text-2xl font-bold">{unallocated.length}</div>
                  </div>
                </div>
                {unallocated.length > 0 && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm">
                    {unallocated.map(a => `P${a.processIndex + 1} (${a.processSize} KB)`).join(', ')}{' '}
                    could not be placed - no free block is large enough. Try a different strategy and compare.
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Each block holds at most one process (fixed partitioning). Leftover space inside an occupied
                  block is internal fragmentation; free blocks too small for waiting processes represent
                  external fragmentation.
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default MemoryAllocation;
