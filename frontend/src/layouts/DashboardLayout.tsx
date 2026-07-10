import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, GitMerge, Activity, Plug, Settings, Server } from "lucide-react";
import { cn } from "../utils/cn";

export function DashboardLayout() {
  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Workflows", path: "/workflows", icon: GitMerge },
    { name: "Executions", path: "/executions", icon: Activity },
    { name: "Providers", path: "/providers", icon: Plug },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-zinc-50 text-zinc-900 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Header */}
          <div className="h-14 flex items-center px-4 border-b border-zinc-200">
            <Server className="w-5 h-5 text-zinc-700 mr-2" />
            <span className="font-semibold text-sm tracking-tight">Workflow Engine</span>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  )
                }
              >
                <item.icon className="w-4 h-4 mr-3 text-zinc-500" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Status */}
        <div className="p-4 border-t border-zinc-200">
          <div className="flex items-center text-xs text-zinc-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            System Online
          </div>
          <div className="text-[10px] text-zinc-400 mt-1 ml-4">v2.5.0</div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Outlet />
      </main>
    </div>
  );
}