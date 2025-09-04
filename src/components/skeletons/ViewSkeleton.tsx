import { Skeleton } from "@/components/ui/skeleton";

export function ViewSkeleton() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header Section */}
      <HeaderSkeleton />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          <ContentSkeleton />
          <RelationsSkeleton />
        </div>

        {/* Sidebar */}
        <SidebarSkeleton />
      </div>
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <header className="mb-6">
      <div className="flex gap-3 items-center justify-between">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-6 w-16 rounded-md" />
        <Skeleton className="h-6 w-20 rounded-md" />
        <Skeleton className="h-6 w-12 rounded-md" />
      </div>
    </header>
  );
}

function ContentSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-full rounded-md" />
      <Skeleton className="h-6 w-5/6 rounded-md" />
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}

function RelationsSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(2)].map((_, i) => (
        <div key={i}>
          <Skeleton className="h-6 w-32 mb-2 rounded-md" />
          <ul className="space-y-2">
            {[...Array(3)].map((_, j) => (
              <li key={j}>
                <Skeleton className="h-5 w-48 rounded-md" />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <aside className="space-y-8">
      {/* Tags */}
      <div>
        <Skeleton className="h-5 w-20 mb-2 rounded-md" />
        <div className="flex flex-wrap gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-12 rounded-md" />
          ))}
        </div>
      </div>

      <Skeleton className="h-px w-full" />

      {/* Status */}
      <div>
        <Skeleton className="h-5 w-20 mb-2 rounded-md" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-3 w-3 rounded-full" />
        </div>
      </div>

      <Skeleton className="h-px w-full" />

      {/* Links */}
      <div>
        <Skeleton className="h-5 w-20 mb-2 rounded-md" />
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-5 w-40 rounded-md" />
          ))}
        </div>
      </div>

      <Skeleton className="h-px w-full" />

      {/* Last updated */}
      <div>
        <Skeleton className="h-5 w-28 mb-2 rounded-md" />
        <Skeleton className="h-5 w-32 rounded-md" />
      </div>
    </aside>
  );
}
