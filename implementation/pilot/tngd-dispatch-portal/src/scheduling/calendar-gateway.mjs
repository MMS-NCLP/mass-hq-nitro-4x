export class InMemoryCalendarGateway {
  #events = new Map();

  createEvent({ idempotencyKey, tenantId, startsAt, endsAt, title, metadata }) {
    const existing = this.#events.get(idempotencyKey);
    if (existing) return existing;
    const event = Object.freeze({
      provider: "approved-calendar-adapter",
      externalEventId: `calendar:${idempotencyKey}`,
      tenantId,
      startsAt,
      endsAt,
      title,
      metadata: structuredClone(metadata)
    });
    this.#events.set(idempotencyKey, event);
    return event;
  }

  updateEvent({ idempotencyKey, ...changes }) {
    const current = this.#events.get(idempotencyKey);
    if (!current) throw new Error("Calendar event does not exist.");
    const updated = Object.freeze({ ...current, ...structuredClone(changes) });
    this.#events.set(idempotencyKey, updated);
    return updated;
  }
}
