import pino from "pino";
import { serverEnv } from "~/env.server";

function loggerStrategy() {
  if (serverEnv.DEV_MODE) {
    const devLogger = pino({
      level: "debug",
      transport: {
        targets: [
          {
            target: "pino-pretty",
            options: { colorize: true, translateTime: "HH:MM:ss" },
          },
        ],
      },
    });

    return devLogger;
  }

  const axiomLogger = pino(
    { level: "info" },
    pino.transport({
      target: "@axiomhq/pino",
      options: {
        dataset: serverEnv.AXIOM_DATASET,
        token: serverEnv.AXIOM_TOKEN,
      },
    })
  );

  return axiomLogger;
}

export const serverLogger = loggerStrategy();
