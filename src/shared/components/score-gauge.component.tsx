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

  const halfRadius = outerRadius * 0.5;
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

const GaugeText = () => {
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
        fontSize: '3rem',
        fontWeight: 'bold',
        fill: 'currentColor',
      }}
    >
      {value.toFixed(1)}
    </text>
  );
};

const GaugeScaleLabels = ({ valueMin, valueMax }: { valueMin: number; valueMax: number; }) => {
  const {
    cx, cy, outerRadius,
  } = useGaugeState();

  const startAngleDeg = -110;
  const endAngleDeg = 110;

  const startAngleRad = (startAngleDeg * Math.PI) / 180;
  const endAngleRad = (endAngleDeg * Math.PI) / 180;

  const labelOffset = 25;

  const startX = cx + (outerRadius + labelOffset) * Math.cos(startAngleRad + Math.PI / 3.36);
  const startY = cy + (outerRadius + labelOffset) * Math.sin(startAngleRad + Math.PI / 1.39);
  const endX = cx + (outerRadius + labelOffset) * Math.cos(endAngleRad + Math.PI / 1.39);
  const endY = cy + (outerRadius + labelOffset) * Math.sin(endAngleRad + Math.PI / 3.6);

  const centerX = cx + 5;
  const centerY = cy - outerRadius - 10;

  return (
    <g>
      <text
        x={startX}
        y={startY}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: '0.75rem',
          fill: 'currentColor',
          opacity: 0.5,
        }}
      >
        {valueMax} 🟢
      </text>
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: '0.75rem',
          fill: 'currentColor',
          opacity: 0.5,
        }}
      >
        ⚪ {(valueMax + valueMin) / 2}
      </text>
      <text
        x={endX}
        y={endY}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: '0.75rem',
          fill: 'currentColor',
          opacity: 0.5,
        }}
      >
        🔴 {valueMin}
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
};

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  value,
  width = 200,
  height = 200,
  min = -10,
  max = 10,
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
        <GaugeText />
        <GaugeScaleLabels
          valueMin={min}
          valueMax={max}
        />
      </GaugeContainer>
    </div>
  );
};
