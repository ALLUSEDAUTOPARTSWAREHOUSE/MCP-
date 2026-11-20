import { OpenTelemetry } from "@ai-sdk/otel"
import { PostHogSpanProcessor } from "@posthog/ai/otel"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { resourceFromAttributes } from "@opentelemetry/resources"
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs"
import { NodeSDK } from "@opentelemetry/sdk-node"
import { registerTelemetry } from "ai"

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

export const posthogSpanProcessor = projectToken && host
  ? new PostHogSpanProcessor({
      projectToken,
      host,
      privacyMode: false,
    })
  : undefined

// This provider is intentionally separate from the global logger: only log records
// emitted through posthogLogsLogger are sent to PostHog.
export const posthogLogsProvider = projectToken && host
  ? new LoggerProvider({
      resource: resourceFromAttributes({
        "service.name": "auapw-web",
      }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: `${host}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${projectToken}`,
              "Content-Type": "application/json",
            },
          }),
        }),
      ],
    })
  : undefined

export const posthogLogsLogger = posthogLogsProvider?.getLogger("auapw-posthog-logs")

export function flushPostHogLogs() {
  return posthogLogsProvider ? posthogLogsProvider.forceFlush().catch(() => {}) : Promise.resolve()
}

export function flushPostHogAiTelemetry() {
  return posthogSpanProcessor ? posthogSpanProcessor.forceFlush().catch(() => {}) : Promise.resolve()
}

export async function register() {
  if (!posthogSpanProcessor) {
    if (process.env.NODE_ENV !== "production") {
      const missingVariable = projectToken ? "NEXT_PUBLIC_POSTHOG_HOST" : "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN"
      console.warn(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`)
    }
    return
  }

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      "service.name": "auapw-web",
    }),
    spanProcessors: [posthogSpanProcessor],
  })
  sdk.start()

  registerTelemetry(
    new OpenTelemetry({
      enrichSpan: ({ runtimeContext }) => ({
        "posthog.distinct_id":
          typeof runtimeContext?.distinctId === "string" ? runtimeContext.distinctId : undefined,
        "$ai_session_id":
          typeof runtimeContext?.sessionId === "string" ? runtimeContext.sessionId : undefined,
        "$ai_trace_name":
          typeof runtimeContext?.traceName === "string" ? runtimeContext.traceName : undefined,
      }),
    }),
  )
}
