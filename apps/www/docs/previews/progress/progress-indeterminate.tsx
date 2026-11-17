import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from '@/registry/ui/progress';

export default function ProgressIndeterminate() {
  return (
    <div className="w-full max-w-sm">
      <Progress value={null} theme="accent">
        <ProgressLabel>Preparing export</ProgressLabel>
        <ProgressValue />
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  );
}
