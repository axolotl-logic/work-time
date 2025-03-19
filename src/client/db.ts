import Dexie, { type EntityTable } from "dexie";

interface TimerState {
  id: number;
  createdAt: number;
  workLength: number;
  breakLength: number;
  startTime: number;
  others: number;
}

interface NavigationState {
  id: number;
  createdAt: number;
  page: "home" | "timer";
  sessionId: string;
}

const db = new Dexie("AppState") as Dexie & {
  timer: EntityTable<TimerState, "id">;
  nav: EntityTable<NavigationState, "id">;
};

db.version(5).stores({
  timer: "++id,workLength,breakLength,startTime,createdAt,others",
  nav: "++id,page,createdAt,sessionId",
});

export type { TimerState };
export { db };
