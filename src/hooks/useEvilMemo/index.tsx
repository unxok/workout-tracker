// TODO I don't know what the real name for this type of thing should be
// but calling it an "evil" memo made sense at the time because this doesn't feel great

// allows a `useMemo` like wrapper for hooks such that they are forced to re-run when a dep updates
// BUT I think this would likely cause unnecessary re-renders...

import { useEffect, useState } from "react";

export const useEvilMemo = <T,>(factory: () => T, deps: unknown[]) => {
  const [_, set] = useState(false);
  useEffect(() => set((b) => !b), deps);

  return factory();
};
