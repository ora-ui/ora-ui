import { Meter, MeterIndicator, MeterLabel, MeterTrack, MeterValue } from '@/registry/ui/meter';

const used = 92;

export default function MeterThresholds() {
  const theme = used >= 90 ? 'destructive' : used >= 75 ? 'warning' : 'accent';

  return (
    <div className="w-full max-w-sm">
      <Meter value={used} theme={theme}>
        <MeterLabel>Monthly API quota</MeterLabel>
        <MeterValue />
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </div>
  );
}
