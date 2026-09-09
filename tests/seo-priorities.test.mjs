import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const priorityArticles = [
  "cafe-minceur-naturel",
  "meilleur-cafe-minceur",
  "cafe-minceur-et-regularite",
  "cafe-minceur-et-petit-dejeuner",
  "cafe-minceur-apres-50-ans",
];

for (const slug of priorityArticles) {
  test(`${slug} transmet un lien éditorial vers la page principale`, async () => {
    const html = await readFile(new URL(`../articles/${slug}/index.html`, import.meta.url), "utf8");
    assert.match(html, /<a href="\.\.\/\.\.\/index\.html">Découvrir Café Minceur et ses offres<\/a>/);
  });
}
