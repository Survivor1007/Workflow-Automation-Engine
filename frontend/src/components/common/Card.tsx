import React from "react";
import { cn } from "../../utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div 
      className={cn("bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden", className)} 
      {...props}
    >
      {children}
    </div>
  );
}