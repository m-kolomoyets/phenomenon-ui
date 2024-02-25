import { forwardRef, memo } from "react";
import {
  Item as RadixSelectItem,
  ItemText as SelectItemText,
  ItemIndicator as SelectItemIndicator,
} from "@radix-ui/react-select";
import clsx from "clsx";
import type { SelectOptionProps } from "./types";
import s from "./SelectOption.module.css";

const SelectItem = forwardRef<HTMLDivElement, SelectOptionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <RadixSelectItem
        ref={ref}
        className={clsx(s.wrap, className, "focus-primary")}
        {...props}
      >
        <SelectItemText asChild>{children}</SelectItemText>
        <SelectItemIndicator className={s.indicator}>
          {/* NOTE: Icon component here */}✅
        </SelectItemIndicator>
      </RadixSelectItem>
    );
  }
);

export default memo(SelectItem);
