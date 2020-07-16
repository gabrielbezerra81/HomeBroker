import { useRef, useEffect } from "react";

export default function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
