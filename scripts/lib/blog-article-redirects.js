/**
 * Correspondances exactes articles blog migrés :
 *   /blog/<slug>/  →  /blog/articles/<slug>/
 *
 * Ne touche PAS aux articles qui gardent volontairement permalink: /blog/<slug>/.
 * Ne génère PAS de wildcard /blog/* → /blog/articles/*.
 */
const fs = require("fs");
const path = require("path");

const ARTICLES_DIR = path.join(__dirname, "..", "..", "src", "blog", "articles");
const RESERVED_SLUGS = new Set(["articles", "tag", "page", "drafts", "index"]);

function parsePermalink(frontMatterText) {
  const match = frontMatterText.match(/^permalink:\s*(.+)$/m);
  if (!match) return null;
  return match[1].trim().replace(/^["']|["']$/g, "");
}

function classifyArticles() {
  const kept = [];
  const migrated = [];

  if (!fs.existsSync(ARTICLES_DIR)) {
    return { kept, migrated };
  }

  for (const file of fs.readdirSync(ARTICLES_DIR)) {
    if (!file.endsWith(".njk")) continue;
    const slug = file.replace(/\.njk$/, "");
    if (RESERVED_SLUGS.has(slug)) continue;

    let text = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

    const permalink = parsePermalink(text);
    if (permalink && /^\/blog\/[^/]+\/?$/.test(permalink) && !permalink.includes("/articles/")) {
      const normalized = permalink.endsWith("/") ? permalink : `${permalink}/`;
      kept.push({ slug, permalink: normalized, file });
      continue;
    }

    const newPath =
      permalink && permalink.includes("/blog/articles/")
        ? permalink.endsWith("/")
          ? permalink
          : `${permalink}/`
        : `/blog/articles/${slug}/`;

    migrated.push({ slug, newPath, file, permalink: permalink || null });
  }

  return { kept, migrated };
}

/**
 * @returns {Array<[string, string]>} from → to
 */
function getMigratedBlogRedirectPairs() {
  const { migrated } = classifyArticles();
  const pairs = [];

  for (const { slug, newPath } of migrated) {
    const oldSlash = `/blog/${slug}/`;
    const oldNoSlash = `/blog/${slug}`;
    const oldHtml = `/blog/${slug}.html`;

    // Variantes anciennes uniquement — jamais l'URL canonique nouvelle
    pairs.push([oldSlash, newPath]);
    pairs.push([oldNoSlash, newPath]);
    pairs.push([oldHtml, newPath]);
  }

  return pairs;
}

function getKeptBlogSlugs() {
  return new Set(classifyArticles().kept.map((item) => item.slug));
}

function getMigratedBlogSlugs() {
  return new Set(classifyArticles().migrated.map((item) => item.slug));
}

module.exports = {
  ARTICLES_DIR,
  classifyArticles,
  getMigratedBlogRedirectPairs,
  getKeptBlogSlugs,
  getMigratedBlogSlugs,
};
