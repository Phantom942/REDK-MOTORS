export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path.endsWith(".html")) {
      const dest = new URL(path.slice(0, -5) + "/" + url.search, "https://redkmotors.fr");
      return Response.redirect(dest.toString(), 301);
    }

    const bucket = path.charAt(1) || "_";
    const keys =
      bucket === "e"
        ? ["r:en", "r:eq", "r:ex0", "r:ex1", "r:ex2", "r:ex3"]
        : [`r:${bucket}`];

    for (const key of keys) {
      let shard = await env.REDIRECTS.get(key, { type: "json" });
      if (typeof shard === "string") {
        try {
          shard = JSON.parse(shard);
        } catch {
          /* ignore malformed shard */
        }
      }
      const targetPath = shard?.[path];
      if (targetPath && targetPath !== path) {
        const dest = new URL(targetPath, "https://redkmotors.fr");
        dest.search = url.search;
        return Response.redirect(dest.toString(), 301);
      }
    }

    return fetch(request);
  },
};
