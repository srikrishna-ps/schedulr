import { useMemo, useEffect, useRef, useState } from 'react';
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

    const uniqueProcesses = Array.from(new Set(executionOrder.map(block => block.processId)));
    const colorMap = uniqueProcesses.reduce((acc, processId, index) => {
      acc[processId] = processColors[index % processColors.length];
      return acc;
    }, {} as Record<string, string>);

    const maxTime = Math.max(...executionOrder.map(block => block.endTime));

    const blocks = executionOrder.map((block, index) => ({
      ...block,
      widthPercent: ((block.endTime - block.startTime) / maxTime) * 100,
      leftPercent: (block.startTime / maxTime) * 100,
      colorClass: colorMap[block.processId],
      delay: index * 100
    }));

    return {
      processColorMap: colorMap,
      totalTime: maxTime,
      timelineBlocks: blocks
    };
  }, [executionOrder]);

  const timelineRef = useRef<HTMLDivElement>(null);
  const [markerSteps, setMarkerSteps] = useState<number[]>([]);

  useEffect(() => {
    if (!timelineRef.current || totalTime === 0) return;

    const containerWidth = timelineRef.current.clientWidth;
    const MIN_GAP = 40; // px per marker
    const maxMarkers = Math.floor(containerWidth / MIN_GAP);
    const step = Math.ceil(totalTime / maxMarkers) || 1;

    const steps = [];
    for (let i = 0; i <= totalTime; i += step) {
      steps.push(i);
    }
    setMarkerSteps(steps);
  }, [totalTime, executionOrder]);

  if (!executionOrder || executionOrder.length === 0) {
    return (
      <Card className="group border border-border/60 shadow-md bg-background/90 backdrop-blur-md">
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
    <Card className="group border border-border/60 shadow-md bg-background/90 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Gantt Chart
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Legend */}
          <div className="flex flex-wrap gap-3">
            {Object.entries(processColorMap).map(([processId, colorClass]) => (
              <div key={processId} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${colorClass}`}></div>
                <span className="text-sm font-medium">{processId}</span>
              </div>
            ))}
          </div>

          {/* Gantt Chart Timeline */}
          <div>
            <div ref={timelineRef} className="relative h-16 w-full rounded-lg border border-primary/20 overflow-hidden bg-muted/30">
              {timelineBlocks.map((block, index) => (
                <div
                  key={`${block.processId}-${block.startTime}-${index}`}
                  className={`absolute top-0 h-full ${block.colorClass} border-r border-background/30 flex items-center justify-center text-white font-semibold text-sm`}
                  style={{
                    left: `${block.leftPercent}%`,
                    width: `${block.widthPercent}%`,
                    minWidth: '24px',
                    animationDelay: `${block.delay}ms`
                  }}
                >
                  {block.processId}
                </div>
              ))}
            </div>

            {/* Time markers */}
            <div className="relative h-6 mt-2 w-full">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-primary/30"></div>
              {markerSteps.map((t) => (
                <div
                  key={t}
                  className="absolute flex flex-col items-center text-xs text-muted-foreground"
                  style={{ left: `${(t / totalTime) * 100}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="w-0.5 h-3 bg-primary/60 rounded"></div>
                  <span className="mt-1">{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Execution Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {executionOrder.map((block, index) => (
              <div
                key={`${block.processId}-${block.startTime}-${index}`}
                className="flex items-center gap-3 p-3 bg-muted/10 rounded-lg border border-primary/10"
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
