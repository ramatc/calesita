import { cn } from "@/lib/utils";

const CANOPY_STRIPES = [
  { d: "M240 34 40 150h64Z", fill: "var(--brand-pink)" },
  { d: "M240 34 104 150h68Z", fill: "var(--brand-yellow)" },
  { d: "M240 34 172 150h68Z", fill: "var(--brand-teal)" },
  { d: "M240 34v116h68Z", fill: "var(--brand-orange)" },
  { d: "M240 34 308 150h68Z", fill: "var(--brand-pink)" },
  { d: "M240 34 376 150h64Z", fill: "var(--brand-yellow)" },
];

const VALANCE_COLORS = [
  "var(--brand-pink)",
  "var(--brand-yellow)",
  "var(--brand-teal)",
  "var(--brand-orange)",
  "var(--brand-pink)",
  "var(--brand-yellow)",
  "var(--brand-teal)",
  "var(--brand-orange)",
];

const BULB_POSITIONS = Array.from({ length: 13 }, (_, index) => 40 + index * 33.33);

const RIDES = [
  { x: 96, color: "var(--brand-teal)", delay: "0s" },
  { x: 240, color: "var(--brand-pink)", delay: "-1.1s" },
  { x: 384, color: "var(--brand-orange)", delay: "-2.1s" },
];

type RideProps = {
  x: number;
  color: string;
  delay: string;
};

/** A pole fixed between canopy and floor, with a horse that bobs along it. */
function Ride({ x, color, delay }: RideProps) {
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x="-3" y="170" width="6" height="200" rx="3" fill="var(--foreground)" />
      <g
        className="animate-bob motion-reduce:animate-none"
        style={{ animationDelay: delay }}
      >
        <g transform="translate(-46 244)">
          <path
            d="M13 34 C4 34 0 44 2 54 C6 50 10 46 16 42Z"
            fill="var(--brand-yellow)"
          />
          <path
            d="M12 34 C20 26 44 26 58 30 C62 22 64 12 72 6 L74 0 L79 6 C86 8 92 14 96 20 L92 26 L80 24 C78 32 74 40 68 44 L76 58 L84 56 L86 62 L72 68 L58 50 C48 52 36 52 28 50 L18 62 L24 74 L17 76 L8 60 L14 46 C10 42 9 38 12 34Z"
            fill={color}
          />
          <path
            d="M72 8 C64 12 58 22 56 30 L62 32 C64 24 68 16 74 12Z"
            fill="var(--brand-yellow)"
          />
          <path d="M30 28 H52 L49 42 H33Z" fill="var(--primary)" />
          <circle cx="83" cy="14" r="2" fill="var(--brand-ink)" />
        </g>
      </g>
    </g>
  );
}

type CarouselIllustrationProps = {
  className?: string;
};

export function CarouselIllustration({ className }: CarouselIllustrationProps) {
  return (
    <svg
      viewBox="0 0 480 420"
      role="img"
      aria-label="Una calesita iluminada de noche"
      className={cn("h-auto w-full", className)}
    >
      <circle cx="240" cy="16" r="12" fill="var(--brand-yellow)" />
      <rect x="237" y="16" width="6" height="24" fill="var(--foreground)" />

      {CANOPY_STRIPES.map((stripe) => (
        <path key={stripe.d} d={stripe.d} fill={stripe.fill} />
      ))}

      {VALANCE_COLORS.map((color, index) => (
        <path
          key={index}
          d={`M${40 + index * 50} 150h50v14a25 25 0 0 1-50 0Z`}
          fill={color}
        />
      ))}

      {BULB_POSITIONS.map((x, index) => (
        <circle
          key={x}
          cx={x}
          cy="150"
          r="6"
          fill="var(--foreground)"
          className="animate-twinkle motion-reduce:animate-none"
          style={{ animationDelay: `${(index % 3) * -0.6}s` }}
        />
      ))}

      {RIDES.map((ride) => (
        <Ride key={ride.x} {...ride} />
      ))}

      <rect x="24" y="366" width="432" height="18" rx="9" fill="var(--secondary)" />
      <rect x="44" y="384" width="392" height="14" rx="7" fill="var(--primary)" />
    </svg>
  );
}
