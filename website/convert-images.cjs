
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputDir = path.join(__dirname, "public");
const outputDir = path.join(__dirname, "public", "images-webp");

async function convertFolder(source, destination) {
  fs.mkdirSync(destination, { recursive: true });

  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    // Don't scan the output folder again
    if (entry.name === "images-webp" && source === inputDir) {
      continue;
    }

    const input = path.join(source, entry.name);

    if (entry.isDirectory()) {
      continue;
    }

    if (!/\.(jpe?g|png)$/i.test(entry.name)) {
      continue;
    }

    // Skip logos and favicons
    if (/logo|favicon|icon/i.test(entry.name)) {
      continue;
    }

    const output = path.join(
      destination,
      entry.name.replace(/\.(jpe?g|png)$/i, ".webp")
    );

    try {
      if (fs.existsSync(output)) {
        console.log("Already exists:", path.basename(output));
        continue;
      }

      await sharp(input)
        .webp({ quality: 80 })
        .toFile(output);

      console.log("Converted:", entry.name, "->", path.basename(output));
    } catch (error) {
      console.error("Failed:", entry.name, error.message);
    }
  }
}

if (!fs.existsSync(inputDir)) {
  console.error("Source folder not found:", inputDir);
} else {
  convertFolder(inputDir, outputDir)
    .then(() => console.log("Conversion completed!"))
    .catch(console.error);
}
