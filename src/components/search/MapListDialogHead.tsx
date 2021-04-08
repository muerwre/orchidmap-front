import React, { FC, memo, useMemo, ChangeEvent, ChangeEventHandler } from 'react';
import Range from 'rc-slider/lib/Range';

interface Props {
  ready: boolean;
  min: number;
  max: number;
  search: string;
  distance: [number, number];
  onDistanceChange: (val: [number, number]) => void;
  onSearchChange: ChangeEventHandler<HTMLInputElement>;
}

const MapListDialogHead: FC<Props> = memo(
  ({ min, max, ready, distance, search, onSearchChange, onDistanceChange }) => {
    const marks = useMemo(
      () =>
        [...new Array(Math.floor((Math.max(min, max) - Math.min(min, max)) / 25) + 1)].reduce(
          (obj, el, i) => ({
            ...obj,
            [min + i * 25]: min + i * 25 < 200 ? ` ${min + i * 25}` : ` ${min + i * 25}+`,
          }),
          {}
        ),
      [max, min]
    );

    return (
      <div className="dialog-head">
        <div>
          <input
            type="text"
            placeholder="Поиск по названию"
            value={search}
            onChange={onSearchChange}
          />

          <div />

          {ready && Object.keys(marks).length > 2 ? (
            <Range
              min={min}
              max={max}
              marks={marks}
              step={25}
              onChange={onDistanceChange}
              defaultValue={[0, 10000]}
              value={distance}
              pushable
              disabled={min >= max}
            />
          ) : (
            <div className="range-placeholder" />
          )}
        </div>
      </div>
    );
  }
);

export { MapListDialogHead };
