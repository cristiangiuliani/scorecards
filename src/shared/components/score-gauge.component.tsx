import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from '@mui/x-charts/Gauge';
import * as React from 'react';

const GaugePointer = () => {
  const {
    valueAngle, outerRadius, cx, cy,
  } = useGaugeState();

  if (valueAngle === null) {
    return null;
  }

  const startPoint = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };

  const halfRadius = outerRadius * 0.6;
  const endPoint = {
    x: cx + halfRadius * Math.sin(valueAngle),
    y: cy - halfRadius * Math.cos(valueAngle),
  };

  return (
    <g>
      <path
        d={`M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`}
        stroke="white"
        strokeWidth={1}
        strokeLinecap="round"
      />
    </g>
  );
};

const GaugeText = ({ fontSize, decimals }: { fontSize: number; decimals?: number }) => {
  const {
    value, cx, cy,
  } = useGaugeState();

  if (value === null) {
    return null;
  }

  return (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="middle"
      style={{
        fontSize: `${fontSize}px`,
        fontWeight: 'bold',
        fill: 'currentColor',
      }}
    >
      {value.toFixed(decimals)}
    </text>
  );
};

const GaugeScaleLabels = ({
  valueMin,
  valueMax,
  minLabel,
  maxLabel,
  labelFontSize,
}: {
  valueMin: number;
  valueMax: number;
  minLabel?: string;
  maxLabel?: string;
  labelFontSize?: number;
}) => {
  const {
    cx, cy, outerRadius,
  } = useGaugeState();

  const startAngleDeg = -110;
  const endAngleDeg = 110;

  const startAngleRad = (startAngleDeg * Math.PI) / 180;
  const endAngleRad = (endAngleDeg * Math.PI) / 180;

  const labelOffset = 25;

  const startX = cx + (outerRadius + labelOffset) * Math.cos(startAngleRad + Math.PI / 3.2);
  const startY = cy + (outerRadius + labelOffset) * Math.sin(startAngleRad + Math.PI / 1.39);
  const endX = cx + (outerRadius + labelOffset) * Math.cos(endAngleRad + Math.PI / 1.49);
  const endY = cy + (outerRadius + labelOffset) * Math.sin(endAngleRad + Math.PI / 3.6);

  // Display logic: use label if provided, otherwise use numeric value
  const displayMax = maxLabel || (valueMin < 0 ? `+${valueMax}` : valueMax);
  const displayMin = minLabel || valueMin;

  return (
    <g>
      <text
        x={startX}
        y={startY}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: `${labelFontSize}px`,
          fill: 'currentColor',
          opacity: 0.5,
        }}
      >
        {displayMax}
      </text>
      <text
        x={endX}
        y={endY}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: `${labelFontSize}px`,
          fill: 'currentColor',
          opacity: 0.5,
        }}
      >
        {displayMin}
      </text>
    </g>
  );
};

type ScoreGaugeProps = {
  value: number;
  width?: number;
  height?: number;
  min?: number;
  max?: number;
  fontSize?: number;
  labelFontSize?: number;
  minLabel?: string;
  maxLabel?: string;
  decimals?: number;
}
export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  value,
  width = 200,
  height = 200,
  min = -10,
  max = 10,
  fontSize = 24,
  labelFontSize = 12,
  minLabel,
  maxLabel,
  decimals = 1,
}) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    }}
    >
      <GaugeContainer
        width={width}
        height={height}
        startAngle={-110}
        endAngle={110}
        value={value}
        valueMin={min}
        valueMax={max}
      >
        <GaugeReferenceArc />
        <GaugeValueArc style={{ fill: 'rgba(255, 255, 255, 0.5)' }} />
        <GaugePointer />
        <GaugeText fontSize={fontSize} decimals={decimals} />
        <GaugeScaleLabels
          valueMin={min}
          valueMax={max}
          minLabel={minLabel}
          maxLabel={maxLabel}
          labelFontSize={labelFontSize}
        />
      </GaugeContainer>
    </div>
  );
};
