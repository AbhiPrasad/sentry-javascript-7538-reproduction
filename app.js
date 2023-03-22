// This file NEEDS to be CommonJS. Opentelemetry does not work with
// ESM modules. So, we use commonJS and import the app file
// at the bottom.
const Sentry = require("@sentry/node");

const express = require("express");

const app = express();

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

app.get("/", function (req, res) {
  Sentry.addBreadcrumb({
    message: "Custom Breadcrumb Inserted",
  });
  console.log("Triggered route");
  return res.json({ success: true });
});

const port = process.env.PORT || 8085;

app.listen(port, () => {
  console.log(`http server listening on port ${port}`);
});
