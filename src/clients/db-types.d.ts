import type { ColumnType } from "kysely";
import type { IPostgresInterval } from "postgres-interval";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<string, bigint | number | string, bigint | number | string>;

export type Interval = ColumnType<IPostgresInterval, IPostgresInterval | number, IPostgresInterval | number>;

export type Json = ColumnType<JsonValue, string, string>;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Numeric = ColumnType<string, number | string, number | string>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface _LanternInternalAutotuneJobs {
  canceledAt: Timestamp | null;
  column: string;
  createdAt: Generated<Timestamp>;
  createIndex: boolean;
  embeddingModel: string | null;
  failedAt: Timestamp | null;
  failureReason: string | null;
  finishedAt: Timestamp | null;
  id: Generated<number>;
  k: number;
  n: number;
  operator: string;
  progress: Generated<number | null>;
  schema: Generated<string>;
  startedAt: Timestamp | null;
  table: string;
  targetRecall: number;
  updatedAt: Generated<Timestamp>;
}

export interface _LanternInternalAutotuneResults {
  buildTime: number | null;
  ef: number;
  efc: number;
  experimentId: number;
  id: Generated<number>;
  latency: number;
  m: number;
  recall: number;
}

export interface _LanternInternalEmbeddingGenerationJobs {
  canceledAt: Timestamp | null;
  createdAt: Generated<Timestamp>;
  dstColumn: string;
  embeddingModel: string;
  failedRequests: Generated<Int8 | null>;
  failedRows: Generated<Int8 | null>;
  id: Generated<number>;
  initFailedAt: Timestamp | null;
  initFailureReason: string | null;
  initFinishedAt: Timestamp | null;
  initProgress: Generated<number | null>;
  initStartedAt: Timestamp | null;
  label: string | null;
  pk: Generated<string>;
  runtime: Generated<string>;
  runtimeParams: Json | null;
  schema: Generated<string>;
  srcColumn: string;
  table: string;
  updatedAt: Generated<Timestamp>;
}

export interface _LanternInternalEmbeddingUsageInfo {
  createdAt: Generated<Timestamp>;
  failed: Generated<boolean>;
  id: Generated<number>;
  jobId: number;
  rows: number;
  tokens: number;
}

export interface _LanternInternalExternalIndexJobs {
  canceledAt: Timestamp | null;
  column: string;
  createdAt: Generated<Timestamp>;
  ef: number;
  efc: number;
  failedAt: Timestamp | null;
  failureReason: string | null;
  finishedAt: Timestamp | null;
  id: Generated<number>;
  index: string | null;
  m: number;
  operator: string;
  progress: Generated<number | null>;
  schema: Generated<string>;
  startedAt: Timestamp | null;
  table: string;
  updatedAt: Generated<Timestamp>;
}

export interface _LanternInternalLanternEmbJobLocks {
  jobId: number;
  rowId: string;
}

export interface CronJob {
  active: Generated<boolean>;
  command: string;
  database: Generated<string>;
  jobid: Generated<Int8>;
  jobname: string | null;
  nodename: Generated<string>;
  nodeport: Generated<number>;
  schedule: string;
  username: Generated<string>;
}

export interface CronJobRunDetails {
  command: string | null;
  database: string | null;
  endTime: Timestamp | null;
  jobid: Int8 | null;
  jobPid: number | null;
  returnMessage: string | null;
  runid: Generated<Int8>;
  startTime: Timestamp | null;
  status: string | null;
  username: string | null;
}

export interface DefaultExtensionsPgBuffercache {
  bufferid: number | null;
  isdirty: boolean | null;
  pinningBackends: number | null;
  relblocknumber: Int8 | null;
  reldatabase: number | null;
  relfilenode: number | null;
  relforknumber: number | null;
  reltablespace: number | null;
  usagecount: number | null;
}

export interface DefaultExtensionsPgStatStatements {
  blkReadTime: number | null;
  blkWriteTime: number | null;
  calls: Int8 | null;
  dbid: number | null;
  jitEmissionCount: Int8 | null;
  jitEmissionTime: number | null;
  jitFunctions: Int8 | null;
  jitGenerationTime: number | null;
  jitInliningCount: Int8 | null;
  jitInliningTime: number | null;
  jitOptimizationCount: Int8 | null;
  jitOptimizationTime: number | null;
  localBlksDirtied: Int8 | null;
  localBlksHit: Int8 | null;
  localBlksRead: Int8 | null;
  localBlksWritten: Int8 | null;
  maxExecTime: number | null;
  maxPlanTime: number | null;
  meanExecTime: number | null;
  meanPlanTime: number | null;
  minExecTime: number | null;
  minPlanTime: number | null;
  plans: Int8 | null;
  query: string | null;
  queryid: Int8 | null;
  rows: Int8 | null;
  sharedBlksDirtied: Int8 | null;
  sharedBlksHit: Int8 | null;
  sharedBlksRead: Int8 | null;
  sharedBlksWritten: Int8 | null;
  stddevExecTime: number | null;
  stddevPlanTime: number | null;
  tempBlkReadTime: number | null;
  tempBlksRead: Int8 | null;
  tempBlksWritten: Int8 | null;
  tempBlkWriteTime: number | null;
  toplevel: boolean | null;
  totalExecTime: number | null;
  totalPlanTime: number | null;
  userid: number | null;
  walBytes: Numeric | null;
  walFpi: Int8 | null;
  walRecords: Int8 | null;
}

export interface DefaultExtensionsPgStatStatementsInfo {
  dealloc: Int8 | null;
  statsReset: Timestamp | null;
}

export interface Docs {
  body: string;
  bodyTsvector: Generated<string | null>;
  branch: string;
  id: Generated<number>;
  path: string;
  title: string;
}

export interface DocsChunks {
  chunkContent: string;
  docId: number;
  id: Generated<number>;
  ordinality: number;
}

export interface LanternTasks {
  duration: Interval | null;
  errorMessage: string | null;
  jobid: Generated<Int8>;
  jobName: string | null;
  pgCronJobName: string | null;
  query: string;
  startedAt: Generated<Timestamp>;
  status: string | null;
  username: Generated<string>;
}

export interface Messages {
  body: string;
  bodyTsvector: Generated<string | null>;
  ccAddresses: string[];
  ccNames: string[];
  fromAddress: string;
  fromName: string;
  id: string;
  inReplyTo: string | null;
  lists: string[] | null;
  subject: string;
  toAddresses: string[];
  toNames: string[];
  ts: Timestamp;
}

export interface MessagesLogs {
  date: string;
  list: string;
}

export interface SchemaMigrations {
  version: string;
}

export interface Scifact {
  denseVector: string | null;
  denseVectorHelper: number[] | null;
  document: string | null;
  id: number;
  sparseVector: string | null;
  sparseVectorHelper: number[] | null;
  sparseVectorHelper2: number[] | null;
  sparseVectorHelper3: number[] | null;
}

export interface ScifactQuery {
  denseVector: string | null;
  denseVectorHelper: number[] | null;
  document: string | null;
  id: number;
  sparseVector: string | null;
  sparseVectorHelper: number[] | null;
  sparseVectorHelper2: number[] | null;
}

export interface Threads {
  messageId: string | null;
  threadId: string | null;
}

export interface DB {
  "_LanternInternal.autotuneJobs": _LanternInternalAutotuneJobs;
  "_LanternInternal.autotuneResults": _LanternInternalAutotuneResults;
  "_LanternInternal.embeddingGenerationJobs": _LanternInternalEmbeddingGenerationJobs;
  "_LanternInternal.embeddingUsageInfo": _LanternInternalEmbeddingUsageInfo;
  "_LanternInternal.externalIndexJobs": _LanternInternalExternalIndexJobs;
  "_LanternInternal.LanternEmbJobLocks": _LanternInternalLanternEmbJobLocks;
  "cron.job": CronJob;
  "cron.jobRunDetails": CronJobRunDetails;
  "defaultExtensions.pgBuffercache": DefaultExtensionsPgBuffercache;
  "defaultExtensions.pgStatStatements": DefaultExtensionsPgStatStatements;
  "defaultExtensions.pgStatStatementsInfo": DefaultExtensionsPgStatStatementsInfo;
  docs: Docs;
  docsChunks: DocsChunks;
  "lantern.tasks": LanternTasks;
  messages: Messages;
  messagesLogs: MessagesLogs;
  schemaMigrations: SchemaMigrations;
  scifact: Scifact;
  scifactQuery: ScifactQuery;
  threads: Threads;
}
