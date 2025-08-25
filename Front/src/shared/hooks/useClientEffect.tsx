import { DependencyList, EffectCallback, useEffect, useRef } from "react";

const useClientEffect = (
  callback: EffectCallback,
  dependencies: DependencyList,
  init: boolean = false
) => {
  const isInitialMount = useRef(init);

  useEffect(() => {
    if (!isInitialMount.current) {
      isInitialMount.current = true;
    } else {
      return callback();
    }
  }, dependencies);
};

export default useClientEffect;
