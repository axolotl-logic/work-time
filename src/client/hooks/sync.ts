import { db, type TimerState } from "~/client/db";
import { useCallback, useEffect } from "react";
import { handleError } from "~/lib/error";
import { ping } from "~/server/actions";
import { MINUTE } from "~/lib/time";
import { useInterval } from "usehooks-ts";
import { useUserId } from "./useUserId";

export function useSync(timer?: TimerState) {
  const userId = useUserId();

  const syncWithServer = useCallback(() => {
    if (!timer) {
      return;
    }
    const { workLength, breakLength, startTime } = timer;

    ping(userId, workLength, breakLength, startTime)
      .then(({ buddiesCount }) => {
        db.timer.add({ ...timer, others: buddiesCount }).catch(handleError);
      })
      .catch((err) => {
        handleError(err);
      });
  }, [userId, timer]);

  useInterval(syncWithServer, 10 * MINUTE);
  useEffect(() => syncWithServer(), [syncWithServer]);
}
