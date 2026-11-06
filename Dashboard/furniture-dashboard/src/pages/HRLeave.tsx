import { CalendarDays } from "lucide-react";

const HRLeave = () => (
  <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
    <div className="mx-auto max-w-5xl">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-green-50 p-2 text-green-700">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">HR &amp; Leave</h1>
            <p className="mt-1 text-sm text-slate-500">
              Leave and HR tools will be available here.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default HRLeave;
