const baseUrl = (process.argv[2] || "http://localhost:3011").replace(/\/$/, "");

const rentalIndexPath = "/services/renting";
const rentalDetailPath = "/services/renting/property/39-groningen-room-in-shared-house";
const offerCompatibleTypes = new Set(["Product", "Service"]);

const fetchHtml = async (path) => {
  const response = await fetch(`${baseUrl}${path}`);
  const html = await response.text();

  return {
    path,
    status: response.status,
    html,
  };
};

const decodeJsonScript = (script) =>
  script
    .replace(/^<script[^>]*>/i, "")
    .replace(/<\/script>$/i, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");

const extractJsonLd = (html, path) => {
  const scripts = html.match(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  );

  if (!scripts) return [];

  return scripts.flatMap((script, index) => {
    try {
      return [JSON.parse(decodeJsonScript(script))];
    } catch (error) {
      throw new Error(
        `${path} has invalid JSON-LD script ${index + 1}: ${error.message}`,
      );
    }
  });
};

const typeNames = (value) => {
  const type = value?.["@type"];
  if (Array.isArray(type)) return type;
  if (typeof type === "string") return [type];
  return [];
};

const collectObjects = (value, objects = []) => {
  if (!value || typeof value !== "object") return objects;

  if (Array.isArray(value)) {
    for (const item of value) collectObjects(item, objects);
    return objects;
  }

  objects.push(value);

  for (const nested of Object.values(value)) {
    collectObjects(nested, objects);
  }

  return objects;
};

const pages = [];
const indexPage = await fetchHtml(rentalIndexPath);
pages.push(indexPage);

if (indexPage.status !== 200) {
  throw new Error(`${rentalIndexPath} returned ${indexPage.status}`);
}

const detailPage = await fetchHtml(rentalDetailPath);
pages.push(detailPage);

if (detailPage.status !== 200) {
  throw new Error(`${rentalDetailPath} returned ${detailPage.status}`);
}

const failures = [];

for (const page of pages) {
  const objects = extractJsonLd(page.html, page.path).flatMap((entry) =>
    collectObjects(entry),
  );

  for (const object of objects) {
    if (!object.offers) continue;

    const types = typeNames(object);
    const hasCompatibleType = types.some((type) =>
      offerCompatibleTypes.has(type),
    );

    if (!hasCompatibleType) {
      failures.push({
        path: page.path,
        name: object.name || object["@id"] || "(unnamed schema node)",
        types: types.join(", ") || "(missing @type)",
      });
    }
  }
}

if (failures.length) {
  console.error("Rental schema validation failed.");
  console.table(failures);
  process.exit(1);
}

console.log("Rental schema validation passed.");
