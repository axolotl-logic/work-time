import { db, type TimerState } from "~/client/db";
import { useCallback, useEffect } from "react";
import { handleError } from "~/lib/error";
import { ping } from "~/server/actions";
import { MINUTE } from "~/lib/time";
import { useInterval } from "usehooks-ts";

export function useSync(timer?: TimerState) {
  const syncWithServer = useCallback(() => {
    if (!timer) {
      return;
    }
    const { userId, workLength, breakLength, startTime } = timer;

    ping(userId, workLength, breakLength, startTime)
      .then(({ buddiesCount }) => {
        db.timer.add({ ...timer, others: buddiesCount }).catch(handleError);
      })
      .catch((err) => {
        handleError(err);
      });
  }, [timer]);

  useInterval(syncWithServer, 10 * MINUTE);
  useEffect(() => syncWithServer(), [syncWithServer]);
}
