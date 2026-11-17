import { Meter, MeterIndicator, MeterLabel, MeterTrack, MeterValue } from '@/registry/ui/meter';

export function MeterGray() {
  return (
    <div className="w-full max-w-sm">
      <Meter value={24} theme="gray">
        <MeterLabel>Storage used</MeterLabel>
        <MeterValue />
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </div>
  );
}

export function MeterAccent() {
  return (
    <div className="w-full max-w-sm">
      <Meter value={24} theme="accent">
        <MeterLabel>Storage used</MeterLabel>
        <MeterValue />
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </div>
  );
}

export function MeterDestructive() {
  return (
    <div className="w-full max-w-sm">
      <Meter value={24} theme="destructive">
        <MeterLabel>Storage used</MeterLabel>
        <MeterValue />
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </div>
  );
}

export function MeterWarning() {
  return (
    <div className="w-full max-w-sm">
      <Meter value={24} theme="warning">
        <MeterLabel>Storage used</MeterLabel>
        <MeterValue />
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </div>
  );
}

export function MeterSuccess() {
  return (
    <div className="w-full max-w-sm">
      <Meter value={24} theme="success">
        <MeterLabel>Storage used</MeterLabel>
        <MeterValue />
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </div>
  );
}

export default MeterGray;
