import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "..");
const sourceRoot = path.join(repoRoot, "src");
const serverClientsPath = path.join(
  sourceRoot,
  "data",
  "supabase",
  "server-clients.ts",
);
const serviceRoleToken = "SUPABASE_SERVICE_ROLE_KEY";

function listSourceFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return listSourceFiles(entryPath);
    }

    if (!entry.isFile() || !/\.(ts|tsx)$/.test(entry.name)) {
      return [];
    }

    return [entryPath];
  });
}

const serverClientsSource = fs.readFileSync(serverClientsPath, "utf8");

if (!serverClientsSource.startsWith('import "server-only";')) {
  throw new Error(
    'Expected src/data/supabase/server-clients.ts to start with import "server-only".',
  );
}

const offenders = listSourceFiles(sourceRoot)
  .filter((filePath) => filePath !== serverClientsPath)
  .filter((filePath) =>
    fs.readFileSync(filePath, "utf8").includes(serviceRoleToken),
  )
  .map((filePath) => path.relative(repoRoot, filePath));

if (offenders.length > 0) {
  throw new Error(
    [
      "SUPABASE_SERVICE_ROLE_KEY must remain server-only.",
      `Unexpected references in: ${offenders.join(", ")}`,
    ].join(" "),
  );
}

console.log(
  [
    "service-role boundary check passed:",
    "- src/data/supabase/server-clients.ts is server-only",
    "- SUPABASE_SERVICE_ROLE_KEY is not referenced anywhere else under src/",
  ].join("\n"),
);
