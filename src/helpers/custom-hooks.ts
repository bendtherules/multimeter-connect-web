import {
  MutableRefObject,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

export function useStateWithRef<TState>(
  initialValue: TState,
): [TState, Dispatch<SetStateAction<TState>>, MutableRefObject<TState>] {
  const [value, setValue] = useState<TState>(initialValue);
  const valueRef = useRef<TState>(initialValue);
  valueRef.current = value;

  return [value, setValue, valueRef];
}
