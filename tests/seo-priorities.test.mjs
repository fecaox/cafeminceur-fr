import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const homepage = await readFile(new URL("../index.html", import.meta.url), "utf8");
const structuredData = JSON.parse(homepage.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
const organization = structuredData["@graph"].find((item) => item["@type"] === "Organization");

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

test("la politique de retour structurée reflète les CGV Café Minceur", () => {
  assert.deepEqual(organization.hasMerchantReturnPolicy, {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "FR",
    returnPolicyCountry: "FR",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 14,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
    merchantReturnLink: "https://www.cafeminceur.fr/livraison-retours/",
  });
});

test("les données structurées n’inventent ni avis ni note agrégée", () => {
  assert.doesNotMatch(homepage, /"(?:review|aggregateRating)"/);
});
