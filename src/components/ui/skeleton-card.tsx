import { Card, CardContent } from "./card";
import { Button } from "./button";

export function SkeletonCard() {
  return (
    <Card className="bg-white rounded-[24.24px] border-0 shadow-sm animate-pulse">
      <CardContent className="p-0">
        <div className="relative w-full h-[150px] sm:h-[180px] aspect-square bg-gray-200 rounded-t-[24.24px] flex items-center justify-center cursor-pointer"></div>
        <div className="p-3 sm:p-[18px]">
          <div className="mb-[4px] h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-[4px]"></div>
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <Button
              size="icon"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-200"
              aria-label="Add to cart"
              disabled
            ></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
