const { GrpcInstrumentation } = require("@opentelemetry/instrumentation-grpc");

const grpcInstrumentation = new GrpcInstrumentation();

const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");

const Sentry = require("@sentry/node");
const {
  SentrySpanProcessor,
  SentryPropagator,
} = require("@sentry/opentelemetry-node");
// const { ProfilingIntegration } = require("@sentry/profiling-node");

// const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");

// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);

const opentelemetry = require("@opentelemetry/sdk-node");

// const { ConsoleSpanExporter } = require("@opentelemetry/sdk-trace-node");

const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-grpc");

const {
  ExpressInstrumentation,
} = require("@opentelemetry/instrumentation-express");

Sentry.init({
  dsn: "https://public@dsn.ingest.sentry.io/1337",

  debug: true,

  instrumenter: "otel",

  release: "testing",
  environment: "sentry-reproduction",
  tracesSampleRate: 1.0,

  profilesSampleRate: 1.0, // Profiling sample rate is relative to tracesSampleRate

  beforeSend: (event) => {
    console.log("Testing");
    console.log(event);
    return null;
  },

  beforeSendTransaction: (transaction) => {
    console.log(transaction);
    return null;
  },

  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    // new ProfilingIntegration(),
  ],
});

const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter(),
  //traceExporter: new ConsoleSpanExporter(),
  instrumentations: [
    grpcInstrumentation,
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
  ],

  // Sentry config
  spanProcessor: new SentrySpanProcessor(),
  textMapPropagator: new SentryPropagator(),
});

sdk.start();
