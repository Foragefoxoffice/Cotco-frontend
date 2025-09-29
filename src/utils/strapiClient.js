// src/cms/strapiClient.js
const base = 'http://localhost:1337'.replace(/\/$/, "");
const token = '0e9ae17aa846f941866381876bb814e405193db3837fad9de320bf146edf950d2ed135a83049353d1e4e9e2a4acc4536b574a75fed3b9b4e24596263384d7dab00b7873583e7030eccdb5694e8bff15016b03c2ff4ba975992db2eaee260459141165a03823ebc7a1ff0a1ec63a0441a8acc6ace33771b8216f3a718ee484fd6';

const json = async (res) => {
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};
const withAuth = () =>
  token ? { headers: { Authorization: `Bearer ${token}` } } : {};

// robust media URL builder (v5 flat or v4 nested)
export const mediaUrl = (maybe) => {
  const url =
    maybe?.url ??
    maybe?.data?.attributes?.url ??
    null;
  if (!url) return "";
  return url.startsWith("http") ? url : `${base}${url}`;
};

export const fetchPosts = async ({ page = 1, pageSize = 12, q = "" } = {}) => {
  const qs = new URLSearchParams({
    "pagination[page]": page,
    "pagination[pageSize]": pageSize,
    "sort[0]": "publishedAt:desc",
    // DEBUG: grab everything to find your image field name
    "populate": "*",
  });

  if (q) {
    qs.set("filters[$or][0][title][$containsi]", q);
    qs.set("filters[$or][1][excerpt][$containsi]", q);
  }

  return json(await fetch(`${base}/api/posts?${qs}`, withAuth()));
};
