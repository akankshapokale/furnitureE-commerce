import { Star } from "lucide-react";

interface StarsProps {
  value: number;
  size?: number;
}

// Read-only star rating; partial values round to the nearest half.
const Stars = ({ value, size = 16 }: StarsProps) => {
  const rounded = Math.round(value * 2) / 2;

  return (
    <span className="pd-stars" role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((position) => {
        const fill = rounded >= position ? 1 : rounded >= position - 0.5 ? 0.5 : 0;

        return (
          <span key={position} className="pd-star" style={{ width: size, height: size }}>
            <Star size={size} className="pd-star-empty" />
            <span className="pd-star-fill" style={{ width: `${fill * 100}%` }}>
              <Star size={size} fill="currentColor" />
            </span>
          </span>
        );
      })}
    </span>
  );
};

export default Stars;
