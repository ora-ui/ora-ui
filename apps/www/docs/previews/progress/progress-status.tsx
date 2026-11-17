'use client';

import * as React from 'react';
import { Button } from '@/registry/ui/button';
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from '@/registry/ui/progress';

export default function ProgressStatus() {
  const [value, setValue] = React.useState(0);
  const done = value >= 100;

  React.useEffect(() => {
    if (done) return;
    const id = setInterval(() => setValue((v) => Math.min(100, v + 10)), 600);
    return () => clearInterval(id);
  }, [done]);

  return (
    <div className="flex w-full max-w-sm flex-col items-start gap-4">
      <Progress value={value} theme={done ? 'success' : 'accent'}>
        <ProgressLabel>{done ? 'Upload complete' : 'Uploading report.pdf'}</ProgressLabel>
        <ProgressValue />
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
      <Button variant="outline" size="sm" onClick={() => setValue(0)} disabled={!done}>
        Restart
      </Button>
    </div>
  );
}
