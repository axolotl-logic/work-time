import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { v4 as uuidv4 } from "uuid";

export function useUserId(): string {
  const [userId, setUserId] = useLocalStorage("function:useUserId", () =>
    uuidv4(),
  );
  useEffect(() => {
    setUserId(userId);
  }, [userId, setUserId]);

  return userId;
}
