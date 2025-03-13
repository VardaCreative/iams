import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
const Header = () => {
  return <header className="w-full border-b border-border h-16 flex items-center justify-between px-6 backdrop-blur-sm sticky top-0 z-10 bg-cyan-500">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9 bg-background border-none focus-visible:ring-1 h-9 text-sm" />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell size={18} />
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
            3
          </Badge>
        </Button>
      </div>
    </header>;
};
export default Header;