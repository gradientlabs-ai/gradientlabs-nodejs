import { describe, expect, it } from "vitest";

import { GradientLabs, type FetchLike } from "../src/index.js";

interface RecordedRequest {
  input: string;
  method: string;
  body?: string;
}

function setup(status: number, body: unknown): { client: GradientLabs; record: RecordedRequest[] } {
  const record: RecordedRequest[] = [];
  const fetch: FetchLike = (input, init) => {
    record.push({ input, method: init.method, body: init.body });
    return Promise.resolve({
      status,
      text: () => Promise.resolve(body === undefined ? "" : JSON.stringify(body)),
    });
  };
  return { client: new GradientLabs({ apiKey: "sk_test_123", fetch }), record };
}

const BASE = "https://api.gradient-labs.ai";

const noteJson = {
  gradient_labs_id: "note_1",
  id: "spring-sale",
  title: "Spring sale",
  last_modified_by: "user@example.com",
  created: "2026-01-01T00:00:00Z",
  updated: "2026-01-01T00:00:00Z",
  status: "live",
  attributes: { Locale: ["UK"] },
};

const knowledgeBaseJson = {
  gradient_labs_id: "kb_1",
  id: "help-centre",
  name: "Help centre",
  created: "2026-01-01T00:00:00Z",
  updated: "2026-01-01T00:00:00Z",
};

const fileJson = {
  id: "file_1",
  ref: "id-card",
  file_name: "id-card.png",
  content_type: "image/png",
  size_bytes: 1024,
  created: "2026-01-01T00:00:00Z",
};

describe("customers", () => {
  it("lists memories", async () => {
    const memory = {
      external_id: "order_1",
      custom_type: { name: "order", description: "An order" },
      created_at: "2026-07-01T10:00:00Z",
      data: { status: "shipped" },
    };
    const { client, record } = setup(200, { memories: [memory] });

    const memories = await client.customers.listMemories("cust 1");

    expect(memories).toEqual([memory]);
    expect(record[0]!.method).toBe("GET");
    expect(record[0]!.input).toBe(`${BASE}/customers/cust%201/memories`);
  });

  it("batch creates memories on the deprecated endpoint", async () => {
    const { client, record } = setup(200, undefined);

    const result = await client.customers.batchCreateMemories("cust_1", {
      memories: [
        {
          external_id: "order_123",
          custom_type: "order",
          created_at: "2026-07-01T10:00:00Z",
          data: { status: "shipped" },
        },
      ],
    });

    expect(result).toBeUndefined();
    expect(record[0]!.method).toBe("POST");
    expect(record[0]!.input).toBe(`${BASE}/customers/cust_1/memories`);
    expect(JSON.parse(record[0]!.body!).memories[0].custom_type).toBe("order");
  });

  it("batch creates memories on the v2 endpoint", async () => {
    const { client, record } = setup(200, undefined);

    await client.customers.batchCreateMemoriesV2("cust_1", {
      memories: [
        {
          external_id: "order_123",
          custom_type: { name: "order", description: "An order" },
          created_at: "2026-07-01T10:00:00Z",
          data: { status: "shipped" },
        },
      ],
    });

    expect(record[0]!.method).toBe("POST");
    expect(record[0]!.input).toBe(`${BASE}/customers/cust_1/memories/v2`);
    expect(JSON.parse(record[0]!.body!).memories[0].custom_type).toEqual({
      name: "order",
      description: "An order",
    });
  });
});

describe("files", () => {
  it("begins an upload", async () => {
    const upload = {
      upload_id: "up_1",
      upload_url: "https://storage.example.com/up_1",
      content_type: "image/png",
      headers: { "Content-Type": "image/png" },
      expires_at: "2026-01-01T00:15:00Z",
      max_bytes: 5242880,
    };
    const { client, record } = setup(200, upload);

    const rsp = await client.files.beginUpload({ content_type: "image/png" });

    expect(rsp).toEqual(upload);
    expect(record[0]!.method).toBe("POST");
    expect(record[0]!.input).toBe(`${BASE}/file-uploads`);
    expect(JSON.parse(record[0]!.body!)).toEqual({ content_type: "image/png" });
  });

  it("creates a file from an upload", async () => {
    const { client, record } = setup(200, fileJson);

    const file = await client.files.create({
      upload_id: "up_1",
      file_name: "id-card.png",
      ref: "id-card",
    });

    expect(file.ref).toBe("id-card");
    expect(record[0]!.method).toBe("POST");
    expect(record[0]!.input).toBe(`${BASE}/files`);
    expect(JSON.parse(record[0]!.body!)).toEqual({
      upload_id: "up_1",
      file_name: "id-card.png",
      ref: "id-card",
    });
  });

  it("lists one page of files with the cursor", async () => {
    const { client, record } = setup(200, { files: [fileJson], pagination: { next: "c2" } });

    const page = await client.files.list({ cursor: "c1" });

    expect(page.data).toHaveLength(1);
    expect(page.pageInfo.next).toBe("c2");
    expect(record[0]!.method).toBe("GET");
    expect(record[0]!.input).toBe(`${BASE}/files?cursor=c1`);
  });
});

describe("knowledge bases", () => {
  it("lists knowledge bases", async () => {
    const { client, record } = setup(200, { knowledge_bases: [knowledgeBaseJson] });

    const list = await client.knowledgeBases.list();

    expect(list).toEqual([knowledgeBaseJson]);
    expect(record[0]!.method).toBe("GET");
    expect(record[0]!.input).toBe(`${BASE}/knowledge-bases`);
  });

  it("creates a knowledge base", async () => {
    const { client, record } = setup(200, knowledgeBaseJson);

    await client.knowledgeBases.create({ id: "help-centre", name: "Help centre" });

    expect(record[0]!.method).toBe("POST");
    expect(record[0]!.input).toBe(`${BASE}/knowledge-bases`);
    expect(JSON.parse(record[0]!.body!)).toEqual({ id: "help-centre", name: "Help centre" });
  });

  it("reads a knowledge base", async () => {
    const { client, record } = setup(200, knowledgeBaseJson);

    const kb = await client.knowledgeBases.get("help-centre");

    expect(kb.name).toBe("Help centre");
    expect(record[0]!.method).toBe("GET");
    expect(record[0]!.input).toBe(`${BASE}/knowledge-bases/help-centre`);
  });

  it("updates a knowledge base with POST", async () => {
    const { client, record } = setup(200, knowledgeBaseJson);

    await client.knowledgeBases.update("help-centre", { name: "Help" });

    expect(record[0]!.method).toBe("POST");
    expect(record[0]!.input).toBe(`${BASE}/knowledge-bases/help-centre`);
    expect(JSON.parse(record[0]!.body!)).toEqual({ name: "Help" });
  });
});

describe("notes", () => {
  it("lists one page of notes with the cursor", async () => {
    const { client, record } = setup(200, { notes: [noteJson], pagination: { next: "c2" } });

    const page = await client.notes.list({ cursor: "c1" });

    expect(page.data[0]!.attributes).toEqual({ Locale: ["UK"] });
    expect(page.pageInfo.next).toBe("c2");
    expect(record[0]!.method).toBe("GET");
    expect(record[0]!.input).toBe(`${BASE}/notes?cursor=c1`);
  });

  it("follows cursors when iterating all notes", async () => {
    const pages = [
      { notes: [noteJson], pagination: { next: "c2" } },
      { notes: [{ ...noteJson, id: "second" }], pagination: {} },
    ];
    const record: RecordedRequest[] = [];
    const client = new GradientLabs({
      apiKey: "sk_test_123",
      fetch: (input, init) => {
        record.push({ input, method: init.method });
        return Promise.resolve({
          status: 200,
          text: () => Promise.resolve(JSON.stringify(pages[record.length - 1])),
        });
      },
    });

    const ids: string[] = [];
    for await (const note of client.notes.listAll()) {
      ids.push(note.id);
    }

    expect(ids).toEqual(["spring-sale", "second"]);
    expect(record[1]!.input).toBe(`${BASE}/notes?cursor=c2`);
  });

  it("reads a note", async () => {
    const { client, record } = setup(200, noteJson);

    const note = await client.notes.get("spring-sale");

    expect(note.title).toBe("Spring sale");
    expect(record[0]!.method).toBe("GET");
    expect(record[0]!.input).toBe(`${BASE}/notes/spring-sale`);
  });

  it("sends attributes and knowledge bases when creating a note", async () => {
    const { client, record } = setup(200, noteJson);

    await client.notes.create({
      id: "spring-sale",
      title: "Spring sale",
      body: "20% off",
      attributes: { Locale: ["UK"] },
      knowledge_base_ids: ["help-centre"],
    });

    expect(JSON.parse(record[0]!.body!)).toEqual({
      id: "spring-sale",
      title: "Spring sale",
      body: "20% off",
      attributes: { Locale: ["UK"] },
      knowledge_base_ids: ["help-centre"],
    });
  });
});

describe("changed fields", () => {
  it("sends knowledge base IDs and a hand-off target ref", async () => {
    const articles = setup(200, undefined);
    await articles.client.articles.upsert({
      id: "a1",
      author_id: "u1",
      title: "T",
      description: "D",
      body: "B",
      visibility: "public",
      topic_id: "t1",
      status: "published",
      data: {},
      created: "2026-01-01T00:00:00Z",
      last_edited: "2026-01-01T00:00:00Z",
      public_url: "https://example.com/a1",
      knowledge_base_ids: ["help-centre"],
    });
    expect(JSON.parse(articles.record[0]!.body!).knowledge_base_ids).toEqual(["help-centre"]);

    const targets = setup(200, undefined);
    await targets.client.handOffTargets.upsert({ id: "billing", name: "Billing", ref: "billing" });
    expect(JSON.parse(targets.record[0]!.body!).ref).toBe("billing");
  });

  it("reads the live hand-off URL on a call context", async () => {
    const { client } = setup(200, {
      started_at: "2026-01-01T00:00:00Z",
      live_handoff_url: "https://example.com/live",
    });
    const ctx = await client.voice.getLatestCallContext("+14155551234");
    expect(ctx.live_handoff_url).toBe("https://example.com/live");
  });
});
