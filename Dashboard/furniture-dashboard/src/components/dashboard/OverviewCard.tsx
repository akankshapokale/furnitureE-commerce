import {
  ShoppingCart,
  Truck,
  Clock3,
  Package,
  CircleCheck,
  RotateCcw,
} from "lucide-react";
import { Link } from "react-router-dom";

interface OverviewCardProps {
  title: string;
  value: string;
  hint?: string;
}

const OverviewCard = ({ title, value, hint }: OverviewCardProps) => {
  const cardData: Record<
    string,
    {
      icon: React.ElementType;
    }
  > = {
    "Total Orders": {
      icon: ShoppingCart,
    },
    Dispatched: {
      icon: Truck,
    },
    Pending: {
      icon: Clock3,
    },
    "In Transit": {
      icon: Package,
    },
    Delivered: {
      icon: CircleCheck,
    },
    Returned: {
      icon: RotateCcw,
    },
  };

  const Icon = cardData[title]?.icon || Package;

  return (
    <Link
      to="/orders"
      className="
        flex min-w-0
        rounded-none
        border border-gray-200
        bg-white
        p-3.5
        sm:p-4
        transition-colors hover:border-green-300 hover:bg-green-50/30
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2
      "
    >
      {/* Top */}
      <div className="flex w-full min-w-0 items-start justify-between gap-3">

        {/* Title + Value */}
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-500 sm:text-sm">
            {title}
          </p>

          <h2 className="mt-1.5 text-2xl font-bold leading-none text-slate-900 sm:mt-2 sm:text-[28px]">
            {value}
          </h2>
        </div>

        {/* Icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none bg-green-50 sm:h-10 sm:w-10">
          <Icon
            size={20}
            strokeWidth={2}
            className="text-green-600 sm:h-[22px] sm:w-[22px]"
          />
        </div>
      </div>

      {/* Bottom */}
      {hint && (
        <p className="mt-5 text-[11px] leading-4 text-slate-400 sm:mt-7 sm:text-xs sm:leading-5">
          {hint}
        </p>
      )}

    </Link>
  );
};

export default OverviewCard;
