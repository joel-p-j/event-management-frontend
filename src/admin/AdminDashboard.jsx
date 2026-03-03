import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Users, Calendar, Ticket, IndianRupee } from "lucide-react";

function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    const res = await api.get("/admin-api/dashboard/");
    setStats(res.data);
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-32 text-zinc-400">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div>

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-zinc-400 mt-1">
          Real-time snapshot of your platform
        </p>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <DashboardCard title="Total Users" value={stats.users} icon={<Users />} />
        <DashboardCard title="Total Events" value={stats.events} icon={<Calendar />} />
        <DashboardCard title="Total Bookings" value={stats.bookings} icon={<Ticket />} />
        <DashboardCard
          title="Total Revenue"
          value={`₹${stats.revenue}`}
          icon={<IndianRupee />}
          tone="emerald"
        />
      </div>

      {/* LOWER PANELS */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title="Recent Activity">
          <div className="text-sm text-zinc-400 space-y-2">
            <p>• New bookings will appear here</p>
            <p>• New user registrations</p>
            <p>• Newly created events</p>
          </div>
        </Panel>

        <Panel title="System Status">
          <ul className="text-sm space-y-2">
            <li className="text-emerald-400">✔ API Operational</li>
            <li className="text-emerald-400">✔ Payments Active</li>
            <li className="text-emerald-400">✔ QR Verification Enabled</li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}

/* KPI CARD */
function DashboardCard({ title, value, icon, tone = "indigo" }) {
  const tones = {
    indigo: "bg-indigo-500/10 text-indigo-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
  };

  return (
    <div className="rounded-2xl p-6 bg-zinc-900/60 border border-white/5 hover:border-white/10 transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-zinc-400 text-sm">{title}</p>
          <p className="text-3xl font-semibold mt-2 text-white">
            {value}
          </p>
        </div>

        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${tones[tone]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

/* PANEL */
function Panel({ title, children }) {
  return (
    <div className="rounded-2xl p-6 bg-zinc-900/60 border border-white/5">
      <h3 className="text-base font-semibold text-white mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default AdminDashboard;
