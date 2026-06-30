import type { DatabaseClient } from "../../data/supabase/client.types";

export interface QueryResult<T> {
  data: T | null;
  error: { message: string } | null;
}

export interface MockTableState<TAwait = unknown, TSingle = unknown> {
  awaitResult?: QueryResult<TAwait>;
  singleResult?: QueryResult<TSingle>;
  maybeSingleResult?: QueryResult<TSingle>;
}

export interface MockTableCalls {
  delete: Array<[]>;
  eq: Array<[string, unknown]>;
  gte: Array<[string, unknown]>;
  in: Array<[string, unknown[]]>;
  insert: Array<[unknown]>;
  lte: Array<[string, unknown]>;
  order: Array<[string, { ascending: boolean }]>;
  select: Array<[string]>;
  single: Array<[]>;
  maybeSingle: Array<[]>;
  update: Array<[unknown]>;
  upsert: Array<[unknown, unknown]>;
}

export interface MockTable {
  calls: MockTableCalls;
  chain: {
    delete: () => MockTable["chain"];
    eq: (column: string, value: unknown) => MockTable["chain"];
    gte: (column: string, value: unknown) => MockTable["chain"];
    in: (column: string, values: unknown[]) => MockTable["chain"];
    insert: (value: unknown) => MockTable["chain"];
    lte: (column: string, value: unknown) => MockTable["chain"];
    maybeSingle: () => Promise<QueryResult<unknown>>;
    order: (
      column: string,
      options: { ascending: boolean },
    ) => MockTable["chain"];
    select: (columns: string) => MockTable["chain"];
    single: () => Promise<QueryResult<unknown>>;
    then: PromiseLike<QueryResult<unknown>>["then"];
    update: (value: unknown) => MockTable["chain"];
    upsert: (value: unknown, options: unknown) => MockTable["chain"];
  };
}

function createDefaultResult<T>(): QueryResult<T> {
  return {
    data: null,
    error: null,
  };
}

export function createMockTable<TAwait = unknown, TSingle = unknown>(
  state: MockTableState<TAwait, TSingle> = {},
): MockTable {
  const calls: MockTableCalls = {
    delete: [],
    eq: [],
    gte: [],
    in: [],
    insert: [],
    lte: [],
    order: [],
    select: [],
    single: [],
    maybeSingle: [],
    update: [],
    upsert: [],
  };

  const awaitResult = state.awaitResult ?? createDefaultResult<TAwait>();
  const singleResult = state.singleResult ?? createDefaultResult<TSingle>();
  const maybeSingleResult =
    state.maybeSingleResult ?? createDefaultResult<TSingle>();

  const chain: MockTable["chain"] = {
    delete: () => {
      calls.delete.push([]);
      return chain;
    },
    eq: (column, value) => {
      calls.eq.push([column, value]);
      return chain;
    },
    gte: (column, value) => {
      calls.gte.push([column, value]);
      return chain;
    },
    in: (column, values) => {
      calls.in.push([column, values]);
      return chain;
    },
    insert: (value) => {
      calls.insert.push([value]);
      return chain;
    },
    lte: (column, value) => {
      calls.lte.push([column, value]);
      return chain;
    },
    maybeSingle: async () => {
      calls.maybeSingle.push([]);
      return maybeSingleResult as QueryResult<unknown>;
    },
    order: (column, options) => {
      calls.order.push([column, options]);
      return chain;
    },
    select: (columns) => {
      calls.select.push([columns]);
      return chain;
    },
    single: async () => {
      calls.single.push([]);
      return singleResult as QueryResult<unknown>;
    },
    then: (onFulfilled, onRejected) =>
      Promise.resolve(awaitResult as QueryResult<unknown>).then(
        onFulfilled,
        onRejected,
      ),
    update: (value) => {
      calls.update.push([value]);
      return chain;
    },
    upsert: (value, options) => {
      calls.upsert.push([value, options]);
      return chain;
    },
  };

  return {
    calls,
    chain,
  };
}

export function createMockSupabaseClient(
  queues: Record<string, MockTable[]>,
): DatabaseClient {
  return {
    from(table: string) {
      const queue = queues[table];

      if (!queue || queue.length === 0) {
        throw new Error(`Unexpected table access in test: ${table}`);
      }

      return queue.shift()?.chain;
    },
  } as unknown as DatabaseClient;
}
