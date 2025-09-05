import { ComponentStatus } from "@/db/types";

export function matchStatusToColor(statusToMatch: ComponentStatus) {
  switch (statusToMatch) {
    case "Experimental":
      return "bg-yellow-500";
    case "Production-ready":
      return "bg-gradient-to-br from-accent-gradiant-from to-accent-gradiant-to";
    case "Deprecated":
      return "bg-red-500";
  }
}
