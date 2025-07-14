import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { HardDrive } from 'lucide-react';

interface DiskRequest {
  track: number;
  order: number;
}

interface SchedulingResult {
  sequence: number[];
  totalSeekTime: number;
  algorithm: string;
}

const DiskScheduling = () => {
  const [algorithm, setAlgorithm] = useState<'FCFS' | 'SSTF' | 'SCAN' | 'C-SCAN'>('FCFS');
  const [initialHead, setInitialHead] = useState(50);
  const [requests, setRequests] = useState('98,183,37,122,14,124,65,67');
  const [scanDirection, setScanDirection] = useState<'left' | 'right'>('right');
  const [diskSize, setDiskSize] = useState(200);
  const [result, setResult] = useState<SchedulingResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const simulateScheduling = () => {
    const requestList = requests.split(',')
      .map(r => parseInt(r.trim()))
      .filter(r => !isNaN(r) && r >= 0 && r < diskSize);

    if (requestList.length === 0) return;

    let sequence: number[] = [];
    let totalSeekTime = 0;
    let currentPos = initialHead;

    switch (algorithm) {
      case 'FCFS':
        sequence = [initialHead, ...requestList];
        for (let i = 1; i < sequence.length; i++) {
          totalSeekTime += Math.abs(sequence[i] - sequence[i - 1]);
        }
        break;

      case 'SSTF':
        const remaining = [...requestList];
        sequence = [initialHead];

        while (remaining.length > 0) {
          let minDistance = Infinity;
          let nextIndex = 0;

          remaining.forEach((track, index) => {
            const distance = Math.abs(track - currentPos);
            if (distance < minDistance) {
              minDistance = distance;
              nextIndex = index;
            }
          });

          const nextTrack = remaining.splice(nextIndex, 1)[0];
          sequence.push(nextTrack);
          totalSeekTime += Math.abs(nextTrack - currentPos);
          currentPos = nextTrack;
        }
        break;

      case 'SCAN':
        const sortedRequests = [...requestList].sort((a, b) => a - b);
        sequence = [initialHead];

        if (scanDirection === 'right') {
          // Go right first
          const rightRequests = sortedRequests.filter(r => r >= initialHead);
          const leftRequests = sortedRequests.filter(r => r < initialHead).reverse();

          rightRequests.forEach(track => {
            sequence.push(track);
            totalSeekTime += Math.abs(track - currentPos);
            currentPos = track;
          });

          if (leftRequests.length > 0) {
            // Go to end of disk if there were right requests
            if (rightRequests.length > 0) {
              sequence.push(diskSize - 1);
              totalSeekTime += Math.abs((diskSize - 1) - currentPos);
              currentPos = diskSize - 1;
            }

            leftRequests.forEach(track => {
              sequence.push(track);
              totalSeekTime += Math.abs(track - currentPos);
              currentPos = track;
            });
          }
        } else {
          // Go left first
          const leftRequests = sortedRequests.filter(r => r <= initialHead).reverse();
          const rightRequests = sortedRequests.filter(r => r > initialHead);

          leftRequests.forEach(track => {
            sequence.push(track);
            totalSeekTime += Math.abs(track - currentPos);
            currentPos = track;
          });

          if (rightRequests.length > 0) {
            // Go to start of disk if there were left requests
            if (leftRequests.length > 0) {
              sequence.push(0);
              totalSeekTime += Math.abs(0 - currentPos);
              currentPos = 0;
            }

            rightRequests.forEach(track => {
              sequence.push(track);
              totalSeekTime += Math.abs(track - currentPos);
              currentPos = track;
            });
          }
        }
        break;

      case 'C-SCAN':
        const sortedCRequests = [...requestList].sort((a, b) => a - b);
        sequence = [initialHead];

        if (scanDirection === 'right') {
          const rightRequests = sortedCRequests.filter(r => r >= initialHead);
          const leftRequests = sortedCRequests.filter(r => r < initialHead);

          rightRequests.forEach(track => {
            sequence.push(track);
            totalSeekTime += Math.abs(track - currentPos);
            currentPos = track;
          });

          if (leftRequests.length > 0) {
            // Jump to beginning
            sequence.push(diskSize - 1);
            totalSeekTime += Math.abs((diskSize - 1) - currentPos);
            sequence.push(0);
            totalSeekTime += diskSize - 1;
            currentPos = 0;

            leftRequests.forEach(track => {
              sequence.push(track);
              totalSeekTime += Math.abs(track - currentPos);
              currentPos = track;
            });
          }
        }
        break;
    }

    setResult({
      sequence,
      totalSeekTime,
      algorithm
    });
    setCurrentStep(0);
  };

  const animateStep = async () => {
    if (!result || currentStep >= result.sequence.length - 1) return;

    setIsAnimating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentStep(prev => prev + 1);
    setIsAnimating(false);
  };

  const resetAnimation = () => {
    setCurrentStep(0);
    setIsAnimating(false);
  };

  const renderDiskVisualization = () => {
    if (!result) return null;

    const trackHeight = 300;
    const trackWidth = 40;
    const maxTrack = diskSize - 1;

    return (
      <div className="flex justify-center p-4">
        <div className="relative" style={{ height: trackHeight + 40, width: trackWidth + 200 }}>
          {/* Disk track */}
          <div
            className="absolute bg-muted border border-border rounded"
            style={{
              left: trackWidth,
              top: 20,
              width: 20,
              height: trackHeight
            }}
          />

          {/* Track numbers */}
          {[0, 50, 100, 150, maxTrack].map(track => (
            <div
              key={track}
              className="absolute text-xs text-muted-foreground"
              style={{
                left: trackWidth - 30,
                top: 20 + (track / maxTrack) * (trackHeight - 20),
                transform: 'translateY(-50%)'
              }}
            >
              {track}
            </div>
          ))}

          {/* Request positions */}
          {requests.split(',').map((req, index) => {
            const track = parseInt(req.trim());
            if (isNaN(track)) return null;

            const y = 20 + (track / maxTrack) * (trackHeight - 20);
            const isCompleted = result.sequence.slice(1, currentStep + 1).includes(track);
            const isNext = result.sequence[currentStep + 1] === track;

            return (
              <div
                key={index}
                className={`absolute w-3 h-3 rounded-full border-2 ${isCompleted ? 'bg-green-500 border-green-600' :
                  isNext ? 'bg-yellow-500 border-yellow-600 animate-pulse' :
                    'bg-blue-500 border-blue-600'
                  }`}
                style={{
                  left: trackWidth + 20 + 5,
                  top: y,
                  transform: 'translateY(-50%)'
                }}
              />
            );
          })}

          {/* Current head position */}
          {currentStep < result.sequence.length && (
            <div
              className="absolute w-0 h-0 border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-red-500"
              style={{
                left: trackWidth + 5,
                top: 20 + (result.sequence[currentStep] / maxTrack) * (trackHeight - 20),
                transform: 'translateY(-50%)'
              }}
            />
          )}

          {/* Path visualization */}
          {currentStep > 0 && (
            <svg
              className="absolute"
              style={{
                left: trackWidth + 10,
                top: 20,
                width: 20,
                height: trackHeight
              }}
            >
              {result.sequence.slice(0, currentStep + 1).map((track, index) => {
                if (index === 0) return null;
                const prevTrack = result.sequence[index - 1];
                const y1 = (prevTrack / maxTrack) * (trackHeight - 20);
                const y2 = (track / maxTrack) * (trackHeight - 20);

                return (
                  <line
                    key={index}
                    x1="10"
                    y1={y1}
                    x2="10"
                    y2={y2}
                    stroke="red"
                    strokeWidth="2"
                    strokeOpacity="0.7"
                  />
                );
              })}
            </svg>
          )}

          {/* Legend */}
          <div className="absolute" style={{ left: trackWidth + 60, top: 20 }}>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 border border-blue-600 rounded-full" />
                <span>Pending Request</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 border border-yellow-600 rounded-full" />
                <span>Next Request</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 border border-green-600 rounded-full" />
                <span>Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-red-500" />
                <span>Disk Head</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Card className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-primary/30 mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl">
            <div className="p-2 bg-primary/20 rounded-lg">
              <HardDrive className="w-8 h-8 text-primary" />
            </div>
            Disk Scheduling Algorithms
          </CardTitle>
          <p className="text-muted-foreground text-lg">
            Visualize disk head movement and optimize seek times using interactive scheduling strategy simulations.
          </p>
        </CardHeader>
      </Card>

      <Card className="group border border-border/60 shadow-md bg-background/90 backdrop-blur-md transition-all duration-150 will-change-transform hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.025] hover:border-primary focus-within:border-primary">
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="algorithm">Algorithm</Label>
              <Select value={algorithm} onValueChange={(value: any) => setAlgorithm(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FCFS">FCFS (First Come First Served)</SelectItem>
                  <SelectItem value="SSTF">SSTF (Shortest Seek Time First)</SelectItem>
                  <SelectItem value="SCAN">SCAN (Elevator Algorithm)</SelectItem>
                  <SelectItem value="C-SCAN">C-SCAN (Circular SCAN)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="head">Initial Head Position</Label>
              <Input
                id="head"
                type="number"
                min="0"
                max={diskSize - 1}
                value={initialHead}
                onChange={(e) => setInitialHead(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diskSize">Disk Size (tracks)</Label>
              <Input
                id="diskSize"
                type="number"
                min="100"
                max="1000"
                value={diskSize}
                onChange={(e) => setDiskSize(parseInt(e.target.value) || 200)}
              />
            </div>

            {(algorithm === 'SCAN' || algorithm === 'C-SCAN') && (
              <div className="space-y-2">
                <Label htmlFor="direction">Initial Direction</Label>
                <Select value={scanDirection} onValueChange={(value: any) => setScanDirection(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left (towards 0)</SelectItem>
                    <SelectItem value="right">Right (towards end)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="requests">Disk Requests (comma-separated track numbers)</Label>
            <Input
              id="requests"
              placeholder="98,183,37,122,14,124,65,67"
              value={requests}
              onChange={(e) => setRequests(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            <Button onClick={simulateScheduling}>
              Generate Schedule
            </Button>
            {result && (
              <>
                <Button
                  onClick={animateStep}
                  disabled={isAnimating || currentStep >= result.sequence.length - 1}
                >
                  Next Step
                </Button>
                <Button variant="outline" onClick={resetAnimation}>
                  Reset Animation
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="group border border-border/60 shadow-md bg-background/90 backdrop-blur-md transition-all duration-150 will-change-transform hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.025] hover:border-primary focus-within:border-primary lg:col-span-2">
            <CardHeader>
              <CardTitle>Disk Visualization</CardTitle>
              <CardDescription>
                Step {currentStep + 1} of {result.sequence.length} - Current Position: {result.sequence[currentStep]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderDiskVisualization()}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="group border border-border/60 shadow-md bg-background/90 backdrop-blur-md transition-all duration-150 will-change-transform hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.025] hover:border-primary focus-within:border-primary">
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Algorithm:</span>
                  <Badge variant="outline">{result.algorithm}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Total Seek Time:</span>
                  <Badge variant="destructive">{result.totalSeekTime}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Average Seek Time:</span>
                  <Badge variant="outline">
                    {(result.totalSeekTime / (result.sequence.length - 1)).toFixed(1)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Requests Served:</span>
                  <Badge>{result.sequence.length - 1}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group border border-border/60 shadow-md bg-background/90 backdrop-blur-md transition-all duration-150 will-change-transform hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.025] hover:border-primary focus-within:border-primary">
              <CardHeader>
                <CardTitle>Seek Sequence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.sequence.map((track, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-2 rounded ${index === currentStep ? 'bg-primary/20 border border-primary' :
                        index < currentStep ? 'bg-green-500/10' :
                          'bg-muted/50'
                        }`}
                    >
                      <span className="text-sm">
                        {index === 0 ? 'Start' : `Request ${index}`}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{track}</Badge>
                        {index > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            +{Math.abs(track - result.sequence[index - 1])}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Card className="group border border-border/60 shadow-md bg-background/90 backdrop-blur-md transition-all duration-150 will-change-transform hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.025] hover:border-primary focus-within:border-primary">
        <CardHeader>
          <CardTitle>Algorithm Descriptions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">FCFS (First Come First Served)</h4>
                <p className="text-sm text-muted-foreground">
                  Services requests in the order they arrive. Simple but may cause large seek times.
                </p>
              </div>
              <div>
                <h4 className="font-medium">SSTF (Shortest Seek Time First)</h4>
                <p className="text-sm text-muted-foreground">
                  Always selects the request with minimum seek time from current position. May cause starvation.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">SCAN (Elevator Algorithm)</h4>
                <p className="text-sm text-muted-foreground">
                  Head moves in one direction, services all requests in that direction, then reverses.
                </p>
              </div>
              <div>
                <h4 className="font-medium">C-SCAN (Circular SCAN)</h4>
                <p className="text-sm text-muted-foreground">
                  Like SCAN but only services requests in one direction, then jumps to the other end.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiskScheduling;