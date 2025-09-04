import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export default function ComponentsVisualizerSkeleton() {
  const commonCardClassNames =
    "mb-6 w-auto rounded-xl break-inside-avoid grid grid-cols-1 md:grid-cols-2 gap-6";

  const CardSkeleton = ({ height }: { height: number }) => {
    return (
      <Skeleton className={cn(`h-[${height}rem]`, commonCardClassNames)} />
    );
  };

  return (
    <div className="p-6 columns-1 sm:columns-2 lg:columns-3 gap-6 mx-auto max-w-[100rem]">
      <CardSkeleton height={15} />
      <CardSkeleton height={30} />
      <CardSkeleton height={24} />
      <CardSkeleton height={20} />
      <CardSkeleton height={10} />
      <CardSkeleton height={25} />
      <CardSkeleton height={12.5} />
      <CardSkeleton height={30} />
      <CardSkeleton height={20} />
      <CardSkeleton height={19} />
    </div>
  );
}
