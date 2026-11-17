import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from '@/registry/ui/progress';

export function ProgressSolid() {
  return (
    <div className="w-full max-w-sm">
      <Progress value={60} variant="solid" theme="accent">
        <ProgressLabel>Uploading files</ProgressLabel>
        <ProgressValue />
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  );
}

export function ProgressSoft() {
  return (
    <div className="w-full max-w-sm">
      <Progress value={60} variant="soft" theme="accent">
        <ProgressLabel>Uploading files</ProgressLabel>
        <ProgressValue />
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  );
}

export default ProgressSolid;
