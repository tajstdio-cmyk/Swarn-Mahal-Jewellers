import { promises as fs } from "fs";
import path from "path";
import { StoreDatabase } from "./types";
import { DEFAULT_STORE_DATA } from "./defaultStore";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");

async function ensureStoreFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(STORE_FILE);
  } catch {
    await fs.writeFile(
      STORE_FILE,
      JSON.stringify(DEFAULT_STORE_DATA, null, 2),
      "utf-8"
    );
  }
}

export async function readStore(): Promise<StoreDatabase> {
  await ensureStoreFile();
  try {
    const raw = await fs.readFile(STORE_FILE, "utf-8");
    const parsed = JSON.parse(raw) as StoreDatabase;
    const mergedStoreInfo = {
      ...DEFAULT_STORE_DATA.storeInfo,
      ...(parsed.storeInfo || {}),
    };
    if (
      !Array.isArray(mergedStoreInfo.announcements) ||
      mergedStoreInfo.announcements.length === 0
    ) {
      mergedStoreInfo.announcements = DEFAULT_STORE_DATA.storeInfo.announcements;
    }
    return {
      ...DEFAULT_STORE_DATA,
      ...parsed,
      storeInfo: mergedStoreInfo,
      goldRates: { ...DEFAULT_STORE_DATA.goldRates, ...(parsed.goldRates || {}) },
    };
  } catch {
    return DEFAULT_STORE_DATA;
  }
}

export async function writeStore(data: StoreDatabase): Promise<StoreDatabase> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
  return data;
}
