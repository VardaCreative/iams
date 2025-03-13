import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ShoppingCart, Clipboard, Factory, TrendingUp, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  href: string;
  isCollapsed: boolean;
};
const SidebarItem = ({
  icon: Icon,
  label,
  href,
  isCollapsed
}: SidebarItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === href;
  return <Link to={href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-250 group relative overflow-hidden", isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground")}>
      <span className="relative z-10">
        <Icon size={20} className={cn("transition-transform duration-250", isCollapsed ? "mx-auto" : "")} />
      </span>
      {!isCollapsed && <span className="font-medium truncate">{label}</span>}
      {isCollapsed && isActive && <div className="absolute inset-y-0 -right-3 w-1 bg-primary-foreground rounded-l-full" />}
      <div className={cn("absolute inset-0 bg-primary opacity-0 transition-opacity duration-350", isActive ? "opacity-[0.08]" : "group-hover:opacity-[0.03]")} />
    </Link>;
};
const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  return <div className={cn("h-screen flex flex-col border-r border-border bg-card transition-all duration-350 shadow-sm relative", isCollapsed ? "w-16" : "w-64")}>
      <div className="p-4 flex items-center justify-between border-b bg-cyan-500">
        {!isCollapsed && <h2 className="font-bold text-xl text-foreground tracking-tight">Management System</h2>}
        {isCollapsed && <span className="font-bold text-xl text-foreground mx-auto">S</span>}
        <button onClick={toggleSidebar} className="p-1 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors duration-250">
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-auto py-4 px-3 bg-slate-200">
        <nav className="flex flex-col gap-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/" isCollapsed={isCollapsed} />
          <SidebarItem icon={ShoppingCart} label="Purchases" href="/purchases" isCollapsed={isCollapsed} />
          <SidebarItem icon={Clipboard} label="Tasks" href="/tasks" isCollapsed={isCollapsed} />
          <SidebarItem icon={Factory} label="Production" href="/production" isCollapsed={isCollapsed} />
          <SidebarItem icon={TrendingUp} label="Sales" href="/sales" isCollapsed={isCollapsed} />
          <SidebarItem icon={Settings} label="Settings" href="/settings" isCollapsed={isCollapsed} />
        </nav>
      </div>

      <div className={cn("px-3 py-4 border-t border-border", isCollapsed ? "text-center" : "")}>
        <div className="flex items-center gap-3">
          <div className={cn("h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary", isCollapsed ? "mx-auto" : "")}>
            <span className="font-medium text-sm">AK</span>
          </div>
          {!isCollapsed && <div className="truncate">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@spice.com</p>
            </div>}
        </div>
      </div>
    </div>;
};
export default Sidebar;