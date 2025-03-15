import Dexie, { type EntityTable } from "dexie";

interface TimerState {
  id: number;
  userId: string;
  workLength: number;
  breakLength: number;
  startTime: number;
  others?: number;
  createdAt: number;
}

const db = new Dexie("AppState") as Dexie & {
  timer: EntityTable<TimerState, "id">;
};

db.version(1).stores({
  timer: "++id,userId,workLength,breakLength,startTime,createdAt",
});

export type { TimerState };
export { db };
