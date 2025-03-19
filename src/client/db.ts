import Dexie, { type EntityTable } from "dexie";

interface TimerState {
  id: number;
  createdAt: number;
  userId: string;
  workLength: number;
  breakLength: number;
  startTime: number;
  others: number;
}

interface NavigationState {
  id: number;
  createdAt: number;
  page: "home" | "timer";
}

const db = new Dexie("AppState") as Dexie & {
  timer: EntityTable<TimerState, "id">;
  nav: EntityTable<NavigationState, "id">;
};

db.version(1).stores({
  timer: "++id,userId,workLength,breakLength,startTime,createdAt",
});

db.version(2).stores({
  timer: "++id,userId,workLength,breakLength,startTime,createdAt",
  nav: "++id,page,createdAt",
});

db.version(3).stores({
  timer: "++id,userId,workLength,breakLength,startTime,createdAt,others",
  nav: "++id,page,createdAt",
});

export type { TimerState };
export { db };
