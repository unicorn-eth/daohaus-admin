import { useEffect } from "react";
import { useToast } from "@/lib/ui";
import { getMissingEnvVars } from "@/lib/env";
import { DISCORD_INVITE } from "@/lib/utils/constants/links";

export const EnvWarning = () => {
  const { setToast } = useToast();

  useEffect(() => {
    const missing = getMissingEnvVars();
    if (missing.length === 0) return;

    setToast({
      title: "Missing environment variables",
      description: `Some features may not work: ${missing.join(", ")}`,
      toastType: "warning",
      toastLinks: {
        leftLink: {
          path: DISCORD_INVITE,
          text: "Notify support",
        },
      },
      duration: Infinity,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
