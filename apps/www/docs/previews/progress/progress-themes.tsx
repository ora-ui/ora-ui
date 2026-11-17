import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from '@/registry/ui/progress';

export function ProgressGray() {
  return (
    <div className="w-full max-w-sm">
      <Progress value={60} theme="gray">
        <ProgressLabel>Uploading files</ProgressLabel>
        <ProgressValue />
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  );
}

export function ProgressAccent() {
  return (
    <div className="w-full max-w-sm">
      <Progress value={60} theme="accent">
        <ProgressLabel>Uploading files</ProgressLabel>
        <ProgressValue />
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  );
}

export function ProgressDestructive() {
  return (
    <div className="w-full max-w-sm">
      <Progress value={60} theme="destructive">
        <ProgressLabel>Uploading files</ProgressLabel>
        <ProgressValue />
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  );
}

export function ProgressWarning() {
  return (
    <div className="w-full max-w-sm">
      <Progress value={60} theme="warning">
        <ProgressLabel>Uploading files</ProgressLabel>
        <ProgressValue />
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  );
}

export function ProgressSuccess() {
  return (
    <div className="w-full max-w-sm">
      <Progress value={60} theme="success">
        <ProgressLabel>Uploading files</ProgressLabel>
        <ProgressValue />
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  );
}

export default ProgressGray;
