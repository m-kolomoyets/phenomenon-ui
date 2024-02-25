import { forwardRef, memo, useCallback, useId, useRef } from "react";
import {
  Root as SelectRoot,
  Trigger as SelectTrigger,
  Value as SelectValue,
  Icon as SelectIcon,
  Content as SelectContent,
  Portal as SelectPortal,
  ScrollUpButton as SelectScrollUpButton,
  ScrollDownButton as SelectScrollDownButton,
  Viewport as SelectViewport,
} from "@radix-ui/react-select";
import { useVirtual } from "react-virtual";
import clsx from "clsx";
import type { SelectProps } from "./types";
import SelectOption from "./components/SelectOption";
import s from "./Select.module.css";

const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      placeholder,
      value,
      options,
      onChange,
      defaultValue,
      isCleanable = false,
      noOptionsMessage = "No options",
      ...rest
    },
    ref
  ) => {
    const listRef = useRef<React.ElementRef<"ul">>(null);

    const id = useId();

    const totalRows = Object.keys(options).length;
    const virtualizer = useVirtual({
      size: totalRows,
      parentRef: listRef,
    });
    const { virtualItems } = virtualizer;

    const valueChangeHandler = useCallback(
      (newValue: string) => {
        const selectedValue = options[newValue];

        if (selectedValue) {
          onChange(selectedValue);
        }
      },
      [onChange, options]
    );

    const clearValueHandler = useCallback(() => {
      onChange({
        value: "",
        label: "",
      });
    }, [onChange]);

    return (
      <SelectRoot
        value={value?.value}
        defaultValue={defaultValue?.value}
        onValueChange={valueChangeHandler}
        {...rest}
      >
        <div className={clsx(s["trigger-wrap"], "truncate")}>
          <SelectTrigger
            ref={ref}
            className={clsx(s.trigger, "truncate")}
            data-testid="select-trigger"
          >
            <SelectValue placeholder={placeholder} asChild>
              <span>{value?.label}</span>
            </SelectValue>
            <SelectIcon className={s.icon}>
              {/* NOTE: Icon component here */}
            </SelectIcon>
          </SelectTrigger>
          {!rest?.disabled && isCleanable && value?.value ? (
            <button
              className={s.clear}
              data-testid="select-clear"
              onClick={clearValueHandler}
            >
              {/* NOTE: Icon component here */}
              Clear
            </button>
          ) : null}
        </div>
        <SelectPortal>
          <SelectContent className={s.content} position="popper" sideOffset={8}>
            <SelectScrollUpButton className={s["scroll-up-button"]} asChild>
              {/* NOTE: Icon component here */}
              <span>Scroll Up</span>
            </SelectScrollUpButton>
            <SelectViewport className={s.viewport}>
              {totalRows ? (
                <ul
                  ref={listRef}
                  className={s.list}
                  role="listbox"
                  id={id}
                  aria-labelledby={id}
                  style={
                    {
                      height: virtualizer.totalSize,
                    } as React.CSSProperties
                  }
                >
                  {virtualItems.map((item) => {
                    const option = Object.values(options)[item.index];

                    return (
                      <div
                        key={option.value}
                        ref={item.measureRef}
                        className={s["item-wrap"]}
                        style={
                          {
                            transform: `translateY(${item.start}px)`,
                          } as React.CSSProperties
                        }
                      >
                        <SelectOption
                          className={s.item}
                          value={option.value}
                          disabled={option?.disabled}
                        >
                          <span className={clsx(s.text, "truncate")}>
                            {option.label}
                          </span>
                        </SelectOption>
                      </div>
                    );
                  })}
                </ul>
              ) : (
                <div
                  className={clsx(s["empty-wrap"], "truncate")}
                  role="status"
                  aria-label={noOptionsMessage}
                >
                  <span
                    className={clsx(s["empty-text"], "truncate")}
                    title={noOptionsMessage}
                  >
                    {noOptionsMessage}
                  </span>
                </div>
              )}
            </SelectViewport>
            <SelectScrollDownButton className={s["scroll-down-button"]} asChild>
              {/* NOTE: Icon component here */}
              <span>Scroll Down</span>
            </SelectScrollDownButton>
          </SelectContent>
        </SelectPortal>
      </SelectRoot>
    );
  }
);

export default memo(Select);
