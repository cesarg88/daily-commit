import { readFile, writeFile } from "node:fs/promises";

const filePath = new URL("../next-env.d.ts", import.meta.url);
const generatedRoutesImportPattern =
  /^import "\.\/\.next(?:\/dev)?\/types\/routes\.d\.ts";\n/m;

const currentContents = await readFile(filePath, "utf8");

if (generatedRoutesImportPattern.test(currentContents)) {
  const normalizedContents = currentContents.replace(
    generatedRoutesImportPattern,
    "",
  );
  await writeFile(filePath, normalizedContents, "utf8");
}
