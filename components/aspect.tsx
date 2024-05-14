import type { ReactNode } from "react";

interface AspectProps {
  className?: string;
  ratio: number;
  children?: ReactNode;
}

export function Aspect({ children, ratio }: AspectProps) {
  return (
    <div className="relative ">
      <div className="absolute inset-0">{children}</div>
      <div
        className="invisible pointer-events-none"
        style={{
          paddingTop: `calc(100% / ${ratio})`,
        }}
      />
    </div>
  );
}
