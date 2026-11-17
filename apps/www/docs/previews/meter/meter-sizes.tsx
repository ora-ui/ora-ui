import { Meter, MeterIndicator, MeterLabel, MeterTrack, MeterValue } from '@/registry/ui/meter';

export function MeterSm() {
  return (
    <div className="w-full max-w-sm">
      <Meter value={24} size="sm" theme="accent">
        <MeterLabel>Storage used</MeterLabel>
        <MeterValue />
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </div>
  );
}

export function MeterMd() {
  return (
    <div className="w-full max-w-sm">
      <Meter value={24} size="md" theme="accent">
        <MeterLabel>Storage used</MeterLabel>
        <MeterValue />
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </div>
  );
}

export function MeterLg() {
  return (
    <div className="w-full max-w-sm">
      <Meter value={24} size="lg" theme="accent">
        <MeterLabel>Storage used</MeterLabel>
        <MeterValue />
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </div>
  );
}

export default MeterMd;
