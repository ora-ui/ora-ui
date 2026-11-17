import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from '@/registry/ui/progress';

export default function ProgressHero() {
  return (
    <div className="w-full max-w-sm">
      <Progress value={60}>
        <ProgressLabel>Uploading files</ProgressLabel>
        <ProgressValue />
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  );
}
