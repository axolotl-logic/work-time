export type Route =
  | {
      page: "home";
    }
  | {
      page: "timer";
      workLength: number;
      breakLength: number;
      startTime: number;
    };

export function routeToUrl(route: Route): string {
  switch (route.page) {
    case "home":
      return "/";
    case "timer":
      const { workLength, breakLength, startTime } = route;
      return `/timer?workLength=${workLength}&breakLength=${breakLength}&startTime=${startTime}`;
  }
}
