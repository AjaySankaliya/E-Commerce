import React from "react";
import { CircleCheckBig, Clock3, Truck, XCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const STATUS_OPTIONS = ["Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_META = {
  Processing: {
    icon: Clock3,
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  Shipped: {
    icon: Truck,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  Delivered: {
    icon: CircleCheckBig,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  Cancelled: {
    icon: XCircle,
    className: "border-rose-200 bg-rose-50 text-rose-700",
  },
};

const StatusButtonGroup = ({
  value,
  onChange,
  disabled = false,
  compact = false,
  showIcons = true,
  className = "",
}) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className={[
          "w-full rounded-2xl px-4 font-bold shadow-sm focus-visible:ring-0 focus-visible:border-slate-300",
          compact ? "h-11 text-xs" : "h-12 text-sm",
          STATUS_META[value]?.className || "border-slate-200 bg-slate-50 text-slate-700",
          className,
        ].join(" ")}
      >
        <SelectValue placeholder={value} />
      </SelectTrigger>

      <SelectContent className="rounded-2xl border-slate-200 bg-white shadow-xl">
        {STATUS_OPTIONS.map((status) => {
          const Icon = STATUS_META[status].icon;

          return (
            <SelectItem
              key={status}
              value={status}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700"
            >
              <span className="flex items-center gap-2">
                {showIcons && <Icon size={14} />}
                <span>{status}</span>
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default StatusButtonGroup;
