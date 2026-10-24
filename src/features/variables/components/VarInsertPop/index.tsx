import { lazy, Suspense } from "react";
import type { Props } from "./VarInsertPopover";

const VarInsertPopover = lazy(() => import("./VarInsertPopover"));

export default function VarInsertPop(props: Props) {
  if (!props.open) {
    return <>{props.children}</>;
  }
  return (
    <Suspense fallback={<>{props.children}</>}>
      <VarInsertPopover {...props} />
    </Suspense>
  );
}
