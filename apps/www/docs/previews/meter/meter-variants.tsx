import { Meter, MeterIndicator, MeterLabel, MeterTrack, MeterValue } from '@/registry/ui/meter';

export function MeterSolid() {
  return (
    <div className="w-full max-w-sm">
      <Meter value={24} variant="solid">
        <MeterLabel>Storage used</MeterLabel>
        <MeterValue />
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </div>
  );
}

export function MeterSoft() {
  return (
    <div className="w-full max-w-sm">
      <Meter value={24} variant="soft">
        <MeterLabel>Storage used</MeterLabel>
        <MeterValue />
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </div>
  );
}

export default MeterSolid;
