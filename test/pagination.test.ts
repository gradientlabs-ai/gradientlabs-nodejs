import { describe, expect, it } from "vitest";

import { GradientLabs, type FetchLike } from "../src/index.js";
import { paginate } from "../src/internal/pagination.js";

describe("paginate", () => {
  it("follows next cursors until exhausted", async () => {
    const pages = [
      { data: [1, 2], pageInfo: { next: "c1" } },
      { data: [3, 4], pageInfo: { next: "c2" } },
      { data: [5], pageInfo: {} },
    ];
    const seenCursors: Array<string | undefined> = [];

    const collected: number[] = [];
    for await (const n of paginate<number>((cursor) => {
      seenCursors.push(cursor);
      return Promise.resolve(pages[seenCursors.length - 1]!);
    })) {
      collected.push(n);
    }

    expect(collected).toEqual([1, 2, 3, 4, 5]);
    expect(seenCursors).toEqual([undefined, "c1", "c2"]);
  });

  it("stops after a single page when there is no next cursor", async () => {
    let calls = 0;
    const collected: string[] = [];
    for await (const item of paginate<string>(() => {
      calls += 1;
      return Promise.resolve({ data: ["only"], pageInfo: {} });
    })) {
      collected.push(item);
    }
    expect(collected).toEqual(["only"]);
    expect(calls).toBe(1);
  });
});

describe("procedures.listAll", () => {
  it("transparently pages through the procedures endpoint", async () => {
    const page1 = JSON.stringify({
      procedures: [{ id: "p1" }, { id: "p2" }],
      pagination: { next: "cursor-2" },
    });
    const page2 = JSON.stringify({
      procedures: [{ id: "p3" }],
      pagination: {},
    });
    const requestedUrls: string[] = [];
    const responses = [page1, page2];

    const fetchImpl: FetchLike = (input) => {
      requestedUrls.push(input);
      const body = responses[requestedUrls.length - 1]!;
      return Promise.resolve({ status: 200, text: () => Promise.resolve(body) });
    };

    const client = new GradientLabs({ apiKey: "sk_test", fetch: fetchImpl });

    const ids: string[] = [];
    for await (const procedure of client.procedures.listAll()) {
      ids.push(procedure.id);
    }

    expect(ids).toEqual(["p1", "p2", "p3"]);
    expect(requestedUrls).toHaveLength(2);
    // First request has no cursor; second carries the cursor from page one.
    expect(requestedUrls[0]).not.toContain("cursor=");
    expect(requestedUrls[1]).toContain("cursor=cursor-2");
  });
});
