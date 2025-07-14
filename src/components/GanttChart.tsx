import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExecutionBlock } from '@/types/scheduler';
import { Clock } from 'lucide-react';

interface GanttChartProps {
  executionOrder: ExecutionBlock[];
}

const processColors = [
  'bg-process-1', 'bg-process-2', 'bg-process-3', 'bg-process-4',
  'bg-process-5', 'bg-process-6', 'bg-process-7', 'bg-process-8'
];

export const GanttChart = ({ executionOrder }: GanttChartProps) => {
  const { processColorMap, totalTime, timelineBlocks } = useMemo(() => {
    if (executionOrder.length === 0) return { processColorMap: {}, totalTime: 0, timelineBlocks: [] };

    // Create color mapping for processes
    const uniqueProcesses = Array.from(new Set(executionOrder.map(block => block.processId)));
    const colorMap = uniqueProcesses.reduce((acc, processId, index) => {
      acc[processId] = processColors[index % processColors.length];
      return acc;
    }, {} as Record<string, string>);

    const maxTime = Math.max(...executionOrder.map(block => block.endTime));
    
    // Create timeline blocks with proper scaling
    const blocks = executionOrder.map((block, index) => ({
      ...block,
      width: ((block.endTime - block.startTime) / maxTime) * 100,
      left: (block.startTime / maxTime) * 100,
      colorClass: colorMap[block.processId],
      delay: index * 100 // For staggered animation
    }));

    return { 
      processColorMap: colorMap, 
      totalTime: maxTime, 
      timelineBlocks: blocks 
    };
  }, [executionOrder]);

  if (executionOrder.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-card to-muted/20 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Gantt Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            Add processes and select an algorithm to see the Gantt chart
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-card to-muted/20 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Gantt Chart
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Process Legend */}
          <div className="flex flex-wrap gap-3">
            {Object.entries(processColorMap).map(([processId, colorClass]) => (
              <div key={processId} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${colorClass}`}></div>
                <span className="text-sm font-medium">{processId}</span>
              </div>
            ))}
          </div>

          {/* Gantt Chart Timeline */}
          <div className="relative">
            <div className="relative h-16 bg-gradient-to-r from-muted/20 to-muted/40 rounded-lg border border-primary/20 overflow-hidden">
              {timelineBlocks.map((block, index) => (
                <div
                  key={`${block.processId}-${block.startTime}-${index}`}
                  className={`absolute top-0 h-full ${block.colorClass} border-r border-background/30 flex items-center justify-center text-white font-semibold text-sm shadow-lg animate-in slide-in-from-left-full duration-500`}
                  style={{ 
                    left: `${block.left}%`, 
                    width: `${block.width}%`,
                    animationDelay: `${block.delay}ms`
                  }}
                >
                  {block.processId}
                </div>
              ))}
            </div>

            {/* Time markers */}
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              {Array.from({ length: Math.min(totalTime + 1, 20) }, (_, i) => (
                <div key={i} className="text-center">
                  <div className="w-px h-2 bg-primary/40 mx-auto mb-1"></div>
                  <span>{i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Execution Timeline Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {executionOrder.map((block, index) => (
              <div 
                key={`${block.processId}-${block.startTime}-${index}`}
                className="flex items-center gap-3 p-3 bg-muted/10 rounded-lg border border-primary/10 animate-in fade-in duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`w-3 h-3 rounded-full ${processColorMap[block.processId]}`}></div>
                <div className="text-sm">
                  <span className="font-semibold">{block.processId}</span>
                  <span className="text-muted-foreground"> : {block.startTime} → {block.endTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};