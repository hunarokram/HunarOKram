import * as React from 'react';
import { cn } from '@/utils/cn';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("px-8 py-6 md:py-8 lg:px-12 w-full max-w-7xl mx-auto", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center text-sm font-medium text-warm-500 mb-4" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={index}>
                {crumb.href && !isLast ? (
                  <Link href={crumb.href} className="hover:text-brand-600 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={cn(isLast && "text-warm-900")}>
                    {crumb.label}
                  </span>
                )}
                {!isLast && (
                  <ChevronRight className="w-4 h-4 mx-2 text-warm-300" />
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-display font-semibold text-warm-900 tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-warm-500 max-w-2xl text-base">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>

      <div className="h-px bg-warm-200 mt-6 md:mt-8 w-full" />
    </div>
  );
}
