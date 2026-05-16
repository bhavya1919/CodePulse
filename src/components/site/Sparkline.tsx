type Props = {
  data: number[];
  stroke?: string;
  fill?: string;
  height?: number;
  className?: string;
};

export function Sparkline({
  data,
  stroke = "var(--electric)",
  fill = "transparent",
  height = 48,
  className,
}: Props) {
  const w = 100;
  const h = 100;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(" ");
  const area = `0,${h} ${pts} ${w},${h}`;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={className}
      style={{ height, width: "100%" }}
    >
      <polygon points={area} fill={fill} opacity="0.25" />
      <polyline
        points={pts}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
