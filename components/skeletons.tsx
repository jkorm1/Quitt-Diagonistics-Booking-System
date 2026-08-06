"use client";

import type { ReactNode } from "react";

/**
 * Glass-morphic loading skeletons.
 *
 * A soft, translucent, "cloudy" frosted-glass style used for every loading
 * state across the app (booking wizard steps, dashboards, tables, cards).
 * All exports keep the exact same names/props as before, so nothing that
 * already imports from "@/components/skeletons" needs to change.
 */

// ---------------------------------------------------------------------------
// Base building block
// ---------------------------------------------------------------------------

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className = "" }: SkeletonProps) => {
  const hasRounding = /rounded/.test(className);
  return (
    <div
      className={`relative overflow-hidden ${hasRounding ? "" : "rounded-md"} ${className}`}
    >
      {/* frosted glass surface */}
      <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/70 via-blue-50/60 to-sky-100/40 backdrop-blur-sm border border-white/60 shadow-[0_2px_10px_rgba(30,64,175,0.08)]" />
      {/* soft shimmering cloud sweep */}
      <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-transparent via-white/80 to-transparent animate-pulse" />
    </div>
  );
};

// Ambient blurred glass "clouds" used behind full-page skeletons, matching
// the soft blurred blobs already used elsewhere in the app.
const GlassBlobs = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-300 rounded-full opacity-10 blur-3xl" />
    <div className="absolute bottom-0 -left-10 w-72 h-72 bg-yellow-300 rounded-full opacity-10 blur-3xl" />
  </div>
);

// Reusable frosted-glass card wrapper for grouping skeleton content.
const GlassCard = ({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <div
    className={`relative rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md shadow-[0_8px_30px_rgba(30,64,175,0.08)] ${className}`}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// Skeleton for the initial page load
// ---------------------------------------------------------------------------
export const PageSkeleton = () => (
  <div className="relative min-h-screen bg-gradient-to-b from-white to-blue-50 overflow-hidden">
    <GlassBlobs />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>
      <Skeleton className="h-96 w-full rounded-2xl" />
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Skeleton for department cards in booking wizard
// ---------------------------------------------------------------------------
export const DepartmentCardSkeleton = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-blue-950">Select Department</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <GlassCard key={i} className="p-6">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </GlassCard>
      ))}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Skeleton for time slots in booking wizard
// ---------------------------------------------------------------------------
export const TimeSlotsSkeleton = () => (
  <div className="grid grid-cols-2 gap-2">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <Skeleton key={i} className="h-12 rounded-lg" />
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Skeleton for service cards in landing page
// ---------------------------------------------------------------------------
export const ServiceCardSkeleton = () => (
  <GlassCard className="flex flex-col md:flex-row gap-8 items-center p-8">
    <Skeleton className="w-full md:w-1/2 h-64 rounded-xl" />
    <div className="w-full md:w-1/2 space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="space-y-2 mt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  </GlassCard>
);

// ---------------------------------------------------------------------------
// Skeleton for testimonial cards in landing page
// ---------------------------------------------------------------------------
export const TestimonialCardSkeleton = () => (
  <GlassCard className="p-6">
    <div className="flex justify-center mb-4">
      <Skeleton className="h-20 w-20 rounded-full" />
    </div>
    <div className="flex justify-center gap-1 mb-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="w-5 h-5 rounded-full" />
      ))}
    </div>
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-5/6 mb-4 mx-auto" />
    <Skeleton className="h-6 w-1/2 mx-auto" />
  </GlassCard>
);

// ---------------------------------------------------------------------------
// Skeleton for location cards in landing page
// ---------------------------------------------------------------------------
export const LocationCardSkeleton = () => (
  <GlassCard className="h-full p-5">
    <div className="flex items-center gap-2 mb-4">
      <Skeleton className="w-4 h-4 rounded-full" />
      <Skeleton className="h-4 w-20" />
    </div>
    <div className="flex justify-center mb-4">
      <Skeleton className="w-[140px] h-[140px] rounded-xl" />
    </div>
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-3/4" />
  </GlassCard>
);

// ---------------------------------------------------------------------------
// Skeleton for dashboard stats cards
// ---------------------------------------------------------------------------
export const StatsCardSkeleton = () => (
  <GlassCard className="p-6">
    <div className="flex items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  </GlassCard>
);

// ---------------------------------------------------------------------------
// Skeleton for a single table row in dashboards
// ---------------------------------------------------------------------------
export const TableRowSkeleton = ({ columns = 8 }: { columns?: number }) => (
  <tr className="border-b border-blue-100/70">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton className="h-6 w-full" />
      </td>
    ))}
  </tr>
);

// ---------------------------------------------------------------------------
// Skeleton for user management table rows
// ---------------------------------------------------------------------------
export const UserTableRowSkeleton = () => (
  <tr className="border-b border-blue-100/70">
    <td className="px-4 py-3">
      <Skeleton className="h-6 w-32" />
    </td>
    <td className="px-4 py-3">
      <Skeleton className="h-8 w-24 rounded-full" />
    </td>
    <td className="px-4 py-3">
      <Skeleton className="h-6 w-40" />
    </td>
    <td className="px-4 py-3">
      <Skeleton className="h-8 w-20 rounded-lg" />
    </td>
  </tr>
);

// ---------------------------------------------------------------------------
// Full glass table skeleton — header + rows, wrapped in a frosted card.
// Used for appointment tables in the front-desk & admin dashboards while
// data is loading.
// ---------------------------------------------------------------------------
export const AppointmentsTableSkeleton = ({
  columns = 8,
  rows = 6,
}: {
  columns?: number;
  rows?: number;
}) => (
  <GlassCard className="p-6">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-blue-200/70">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="text-left px-4 py-3">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  </GlassCard>
);

// ---------------------------------------------------------------------------
// Full-page skeleton for the admin dashboard's initial load
// (nav bar + stats cards + tabs + table)
// ---------------------------------------------------------------------------
export const AdminDashboardSkeleton = () => (
  <div className="relative min-h-screen bg-gradient-to-b from-white to-blue-50 overflow-hidden">
    <GlassBlobs />

    {/* Nav */}
    <div className="relative bg-white/70 backdrop-blur-md border-b-2 border-blue-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-10 w-40 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>
    </div>

    <div className="relative max-w-7xl mx-auto px-6 py-8">
      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <Skeleton className="h-12 w-32 rounded-lg" />
        <Skeleton className="h-12 w-32 rounded-lg" />
        <Skeleton className="h-12 w-32 rounded-lg" />
      </div>

      {/* Table */}
      <AppointmentsTableSkeleton columns={8} rows={6} />
    </div>
  </div>
);
