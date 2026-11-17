'use client';

import { Meter, MeterIndicator, MeterLabel, MeterTrack, MeterValue } from '@/registry/ui/meter';

export default function MeterRange() {
  return (
    <div className="w-full max-w-sm">
      <Meter value={42} max={128} format={{ style: 'unit', unit: 'gigabyte' }}>
        <MeterLabel>Storage used</MeterLabel>
        <MeterValue>{(formattedValue) => `${formattedValue} of 128 GB`}</MeterValue>
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </div>
  );
}
