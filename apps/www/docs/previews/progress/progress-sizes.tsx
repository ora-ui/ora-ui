import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from '@/registry/ui/progress';

export function ProgressSm() {
  return (
    <div className="w-full max-w-sm">
      <Progress value={60} size="sm" theme="accent">
        <ProgressLabel>Uploading files</ProgressLabel>
        <ProgressValue />
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  );
}

export function ProgressMd() {
  return (
    <div className="w-full max-w-sm">
      <Progress value={60} size="md" theme="accent">
        <ProgressLabel>Uploading files</ProgressLabel>
        <ProgressValue />
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  );
}

export function ProgressLg() {
  return (
    <div className="w-full max-w-sm">
      <Progress value={60} size="lg" theme="accent">
        <ProgressLabel>Uploading files</ProgressLabel>
        <ProgressValue />
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  );
}

export default ProgressMd;
