import { Users, UserSquare2, Calendar } from "lucide-react";

export const nodeConfig = {
  user: {
    color: "#3B82F6",
    hoverColor: "#2563EB",
    icon: <Users className="w-4 h-4" />,
    label: "Users",
  },
  group: {
    color: "#10B981",
    hoverColor: "#059669",
    icon: <UserSquare2 className="w-4 h-4" />,
    label: "Groups",
  },
  event: {
    color: "#F59E0B",
    hoverColor: "#D97706",
    icon: <Calendar className="w-4 h-4" />,
    label: "Events",
  },
};
