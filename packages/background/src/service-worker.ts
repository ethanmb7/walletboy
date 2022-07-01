// This file is only used by the mobile app
import { start } from ".";

self.addEventListener("install", () => {
  start(true);
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.clients.claim();
});
