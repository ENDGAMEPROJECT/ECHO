import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

/**
 * CONFIG
 */
const XLSX_URL = process.env.XLSX_URL;

if (!XLSX_URL) {
  console.error("Error: XLSX_URL not found in .env file");
  process.exit(1);
}

const OUT_DIR = process.cwd(); // adjust if you want output elsewhere
const INDENT = 2;
const XLSX_FILE = "ENDGAME_ER2_i18n.xlsx";
const tmpDir = path.join(OUT_DIR, "tmp");
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
/**
 * Insert a value into a nested object based on an array of keys
 */
function insertNested(obj, keys, value) {
  if (keys.length === 1) {
    obj[keys[0]] = value;
  } else {
    const k = keys[0];
    if (obj[k] === undefined || typeof obj[k] !== "object") {
      obj[k] = {};
    }
    insertNested(obj[k], keys.slice(1), value);
  }
  return obj;
}

/**
 * Build nested object from a flat object where keys may contain dot notation
 */
function nestFromDotNames(namedValues) {
  const out = {};
  for (const [key, val] of Object.entries(namedValues)) {
    const parts = key.split(".");
    insertNested(out, parts, val);
  }
  return out;
}

/**
 * Escape strings for JS (preserves \n as newline escape sequence)
 */
function jsEscape(s) {
  if (typeof s !== "string") return String(s);
  // Escape backslashes EXCEPT when followed by 'n' (to preserve \n)
  return s
    .replace(/\\(?!n)/g, "\\\\")  // Escape backslashes not followed by 'n'
    .replace(/"/g, '\\"')          // Escape double quotes
    .replace(/\r\n/g, "\\n")       // Convert actual CRLF to \n
    .replace(/(?<!\\)\n/g, "\\n")  // Convert actual LF to \n (if not already escaped)
    .replace(/\r/g, "\\n");        // Convert actual CR to \n
}

/**
 * Convert a value to a JS literal string
 */
function toJsLiteral(x) {
  // Handle raw JS expressions (marked with __jsraw__)
  if (x && x.__jsraw__) return x.value;

  if (x === null || x === undefined || (typeof x === "number" && isNaN(x)))
    return "null";

  if (typeof x === "boolean") return x ? "true" : "false";

  if (typeof x === "number") return String(x);

  if (x instanceof Date) {
    const ds = formatDateString(x);
    return `new Date("${jsEscape(ds)}")`;
  }

  // Default: string
  return `"${jsEscape(String(x))}"`;
}

/**
 * Format date as "Month DD YYYY HH:MM:SS"
 */
function formatDateString(date) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const d = new Date(date);
  const month = months[d.getUTCMonth()];
  const day = String(d.getUTCDate()).padStart(2, "0");
  const year = d.getUTCFullYear();
  const hours = String(d.getUTCHours()).padStart(2, "0");
  const mins = String(d.getUTCMinutes()).padStart(2, "0");
  const secs = String(d.getUTCSeconds()).padStart(2, "0");
  return `${month} ${day} ${year} ${hours}:${mins}:${secs}`;
}

/**
 * Create a raw JS expression (won't be quoted)
 */
function jsRaw(value) {
  return { __jsraw__: true, value };
}

/**
 * Render a nested object as JS object literal (pretty-printed)
 */
function renderJsObject(obj, indent = INDENT, level = 0) {
  const pad = (n) => " ".repeat(n);
  const thisIndent = pad(level * indent);
  const nextIndent = pad((level + 1) * indent);

  const keys = Object.keys(obj);
  const lines = [];

  lines.push(`${thisIndent}{`);

  keys.forEach((k, i) => {
    const v = obj[k];
    const isLast = i === keys.length - 1;
    const comma = isLast ? "" : ",";

    if (v !== null && typeof v === "object" && !v.__jsraw__ && !(v instanceof Date)) {
      if (Array.isArray(v)) {
        // Array (supports object items, e.g. comments)
        const arrItems = v.map((item) => {
          if (
            item !== null &&
            typeof item === "object" &&
            !item.__jsraw__ &&
            !(item instanceof Date)
          ) {
            const nestedObjLines = renderJsObject(item, indent, level + 2);
            return nestedObjLines.join("\n");
          }
          return `${pad((level + 2) * indent)}${toJsLiteral(item)}`;
        });

        if (arrItems.length === 0) {
          lines.push(`${nextIndent}${k}: []${comma}`);
        } else {
          lines.push(`${nextIndent}${k}: [`);
          arrItems.forEach((itemStr, itemIdx) => {
            const isLastItem = itemIdx === arrItems.length - 1;
            const itemComma = isLastItem ? "" : ",";
            lines.push(`${itemStr}${itemComma}`);
          });
          lines.push(`${nextIndent}]${comma}`);
        }
      } else {
        // Nested object
        const nested = renderJsObject(v, indent, level + 1);
        const firstLine = nested[0].trimStart();
        lines.push(`${nextIndent}${k}: ${firstLine}`);
        for (let j = 1; j < nested.length - 1; j++) {
          lines.push(nested[j]);
        }
        lines.push(`${nested[nested.length - 1]}${comma}`);
      }
    } else {
      lines.push(`${nextIndent}${k}: ${toJsLiteral(v)}${comma}`);
    }
  });

  lines.push(`${thisIndent}}`);
  return lines;
}

/**
 * Write an array of user objects to a JSX file
 */
function writeDbJsx(rows, exportName, outFile, fileInitLines = []) {
  const userObjects = rows.map((row) => {
    const vals = { ...row };

    // _id should be uuid() expression
    if ("_id" in vals) {
      vals._id = jsRaw("uuid()");
    }

    // updatedAt should be formatDate() expression
    vals.updatedAt = jsRaw("formatDate()");

    // createdAt: convert to new Date("...") JS expression
    if ("createdAt" in vals && vals.createdAt) {
      const ca = vals.createdAt;
      if (ca instanceof Date) {
        vals.createdAt = jsRaw(`new Date("${jsEscape(formatDateString(ca))}")`);
      } else if (ca && String(ca).trim()) {
        vals.createdAt = jsRaw(`new Date("${jsEscape(String(ca))}")`);
      } else {
        delete vals.createdAt;
      }
    }

    // Remove null/undefined entries
    for (const k of Object.keys(vals)) {
      if (vals[k] === null || vals[k] === undefined) {
        delete vals[k];
      }
    }

    // Nest dot-notation fields
    return nestFromDotNames(vals);
  });

  // Render array
  const arrLines = [];
  arrLines.push(`export const ${exportName} = [`);

  userObjects.forEach((obj, i) => {
    const objLines = renderJsObject(obj, INDENT, 1);
    const isLast = i === userObjects.length - 1;

    objLines.forEach((line, j) => {
      if (j === objLines.length - 1 && !isLast) {
        arrLines.push(line + ",");
      } else {
        arrLines.push(line);
      }
    });
  });

  arrLines.push("];");

  // Full file content
  const fileLines = [...fileInitLines, ...arrLines, ""];
  const filePath = path.join(OUT_DIR, outFile);
  fs.writeFileSync(filePath, fileLines.join("\n"), "utf8");
  console.log(`Wrote JSX to: ${filePath}`);
}

/**
 * Download XLSX file from URL
 */
async function downloadXlsx(url, destFile) {
  console.log(`Downloading ${url}...`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(destFile, Buffer.from(buffer));
  console.log(`Saved to: ${destFile}`);
}

/**
 * Convert Google Drive view URL to direct download URL
 */
function getGoogleDriveDownloadUrl(viewUrl) {
  // Extract file ID from URLs like:
  // https://drive.google.com/file/d/{FILE_ID}/view?usp=drive_link
  const fileMatch = viewUrl.match(/\/file\/d\/([^/]+)/);
  if (fileMatch) {
    return `https://drive.google.com/uc?export=download&confirm=t&id=${fileMatch[1]}`;
  }
  // Handle https://drive.google.com/open?id={FILE_ID}&usp=drive_copy
  const openMatch = viewUrl.match(/\/open\?id=([^&]+)/);
  if (openMatch) {
    return `https://drive.google.com/uc?export=download&confirm=t&id=${openMatch[1]}`;
  }
  return viewUrl;
}

/**
 * Download an image from URL and save to destination
 */
async function downloadImage(url, destPath) {
  try {
    const downloadUrl = getGoogleDriveDownloadUrl(url);
    console.log(`  Downloading image: ${path.basename(destPath)}`);
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      console.warn(`  Failed to download image: ${response.status}`);
      return false;
    }
    const contentType = response.headers.get("content-type") || "";
    if (contentType.startsWith("text/html")) {
      console.warn(`  WARNING: Received HTML instead of image for ${path.basename(destPath)} — Google Drive may be blocking the download. URL: ${downloadUrl}`);
      return false;
    }
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(buffer));
    return true;
  } catch (err) {
    console.warn(`  Error downloading image: ${err.message}`);
    return false;
  }
}

/**
 * Process avatarURL field - download image if it's an object with hyperlink
 */
async function processAvatarUrl(avatarData, assetsDir) {
  if (!avatarData) return "";

  // If it's already a string, return as-is
  if (typeof avatarData === "string") return avatarData;

  // If it's an object with text and hyperlink (Excel hyperlink format)
  if (avatarData.text && avatarData.hyperlink) {
    const filename = avatarData.text;
    const destPath = path.join(assetsDir, filename);

    // Download the image
    const success = await downloadImage(avatarData.hyperlink, destPath);
    if (success) {
      // Derive relative URL from assetsDir relative to public/
      const publicDir = path.join(OUT_DIR, "public");
      const relPath = path.relative(publicDir, path.join(assetsDir, filename)).replace(/\\/g, "/");
      return `/${relPath}`;
    }
  }

  return "";
}

/**
 * Read a sheet from the workbook as array of objects
 */
function readSheet(workbook, sheetName) {
  const sheet = workbook.getWorksheet(sheetName);
  if (!sheet) {
    console.warn(`Sheet "${sheetName}" not found`);
    return [];
  }

  const rows = [];
  const headers = [];

  sheet.eachRow((row, rowNumber) => {
    const values = row.values.slice(1); // row.values is 1-indexed, slice to normalize

    if (rowNumber === 1) {
      // First row is headers
      values.forEach((val) => headers.push(val));
    } else {
      // Data rows
      const obj = {};
      values.forEach((val, idx) => {
        if (headers[idx] !== undefined) {
          obj[headers[idx]] = val;
        }
      });
      rows.push(obj);
    }
  });

  return rows;
}

/**
 * Read a value from a row by header name, tolerating case/spacing differences.
 */
function getRowValue(row, headerName) {
  if (!row || !headerName) return undefined;

  if (Object.prototype.hasOwnProperty.call(row, headerName)) {
    return row[headerName];
  }

  const normalize = (value) => String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  const expected = normalize(headerName);
  const matchedKey = Object.keys(row).find((key) => normalize(key) === expected);
  return matchedKey ? row[matchedKey] : undefined;
}

/**
 * Get zero-based column index from a sheet header name.
 */
function getHeaderColumnIndex(sheet, headerName) {
  if (!sheet || !headerName) return -1;
  const normalize = (value) => String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  const expected = normalize(headerName);
  const headerRow = sheet.getRow(1);
  const values = headerRow?.values?.slice(1) || [];
  for (let i = 0; i < values.length; i += 1) {
    if (normalize(values[i]) === expected) return i;
  }
  return -1;
}

/**
 * Normalize AI OK? value from Excel to boolean/null.
 */
function parseAiOkValue(value) {
  if (typeof value === "boolean") return value;
  const normalized = String(value ?? "").trim().toUpperCase();
  if (normalized === "TRUE") return true;
  if (normalized === "FALSE") return false;
  return null;
}

/**
 * Normalize puzzle indicator values from spreadsheet.
 * Returns object with value (boolean) and mandatory (boolean) only for mandatory characteristics.
 * Values: "m" = mandatory, "x" = optional, null/empty = not present.
 */
function parsePuzzleIndicatorValue(value) {
  const normalized = String(value ?? "").trim().toUpperCase();
  
  // Empty/falsy values: characteristic not present
  if (!normalized) {
    return false;
  }
  
  // "M" = mandatory characteristic (must be selected by user)
  if (normalized === "M") {
    return { value: true, mandatory: true };
  }
  
  // "X" = optional characteristic (can be selected but not required)
  // Solo devuelve true para mantener compatibilidad
  if (normalized === "X") {
    return true;
  }
  
  return false;
}

/**
 * Main processing function
 */
async function main() {
  // Download the Excel file
  const xlsxPath = path.join(OUT_DIR, "tmp", XLSX_FILE);
  await downloadXlsx(XLSX_URL, xlsxPath);

  // Read the workbook
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(xlsxPath);

  // Ensure assets directory exists
  const assetsDir = path.join(OUT_DIR, "public/assets");
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // Get the first sheet for i18n
  const firstSheet = workbook.worksheets[0];
  const firstSheetName = firstSheet.name;
  const webI18n = readSheet(workbook, firstSheetName);

  if (webI18n.length === 0) {
    console.error("No data in first sheet");
    return;
  }

  // Get language columns (all columns except the first one which is the key)
  const allKeys = Object.keys(webI18n[0]);
  const keyColumn = allKeys[0]; // First column is the key
  const langs = allKeys.slice(1); // Rest are language columns
  const avatarsDir = path.join(OUT_DIR, "public/assets/users");
  const postsDir = path.join(OUT_DIR, "public/assets/posts");
  for (const lang of langs) {
    console.log(`\nProcessing language: ${lang}`);

    // Web i18n
    const resultList = {};
    for (const row of webI18n) {
      const keyParts = String(row[keyColumn]).split(".");
      const value = row[lang];
      insertNested(resultList, keyParts, value);
    }
    const oldFileI18N = path.join(OUT_DIR, `src/constants/langs/${lang}.js`);
    if (fs.existsSync(oldFileI18N)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const newFileName = `${lang}_${timestamp}.js`;
      fs.renameSync(oldFileI18N, path.join(tmpDir, newFileName));
    }
    // Convert to JSON and write JSX
    let jsonOutput = JSON.stringify(resultList, null, INDENT);
    // Preserve \n as newline escape (JSON.stringify double-escapes it)
    jsonOutput = jsonOutput.replace(/\\\\n/g, "\\n");
    const jsx = `export const ${lang} = ${jsonOutput};`;
    const outFile = `src/constants/langs/${lang}.js`;
    fs.writeFileSync(path.join(OUT_DIR, outFile), jsx, "utf8");
    console.log(`Wrote i18n to: ${outFile}`);

    // Puzzle 1 - Accounts
    const langUpper = lang.toUpperCase();
    const accountsSheetName = `Puzzle 1 accounts ${langUpper}`;
    const accountsData = readSheet(workbook, accountsSheetName);

    if (accountsData.length > 0) {
      console.log(`  Downloading user avatars...`);
      const puzzle1Users = await Promise.all(accountsData.map(async (row) => ({
        _id: "uuid()",
        firstName: row["Account name"] || "",
        lastName: "",
        bio: row["Bio"] || "",
        username: row["Handle"] || "",
        password: "ECHO",
        createdAt: row["Joined"] || "",
        updatedAt: "formatDate()",
        avatarURL: await processAvatarUrl(row["Photo (link)"], avatarsDir),
        verified: row["Verified"] || false,
        "stats.followersCount": row["Followers"] || 0,
        "stats.followingCount": row["Following"] || 0,
        "stats.postsCount": getRowValue(row, "NumPosts") || 0,
        "puzzle.isBot": row["isBot"] === true,
        "puzzle.abnormalRatio": parsePuzzleIndicatorValue(getRowValue(row, "abnormalRatio")),
        "puzzle.recentAccount": parsePuzzleIndicatorValue(getRowValue(row, "recentAccount")),
        "puzzle.temporalActivity": parsePuzzleIndicatorValue(getRowValue(row, "temporalActivity")),
        "puzzle.targetAudience": parsePuzzleIndicatorValue(getRowValue(row, "targetAudience")),
        "puzzle.emotions": parsePuzzleIndicatorValue(getRowValue(row, "emotions")),
      })));
      const oldFileUsers = path.join(OUT_DIR, `src/backend/db/users_${lang}.jsx`);
      if (fs.existsSync(oldFileUsers)) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const newFileName = `users_${lang}_${timestamp}.jsx`;
        fs.renameSync(oldFileUsers, path.join(tmpDir, newFileName));
      }
      writeDbJsx(
        puzzle1Users,
        `users${langUpper}`,
        `src/backend/db/users_${lang}.jsx`,
        [
          'import { v4 as uuid } from "uuid";',
          'import { formatDate } from "../utils/authUtils.jsx";',
          "",
          "/**",
          " *  Users Database",
          " */",
          "",
        ]
      );
    }

    // Puzzle 1 - Posts
    const postsSheetName = `Puzzle 1 posts ${langUpper}`;
    const postsData = readSheet(workbook, postsSheetName);

    if (postsData.length > 0) {
      console.log(`  Downloading post media...`);
      const puzzle1Posts = await Promise.all(postsData.map(async (row) => {
        // Extract comments from Comment1By/Text, Comment2By/Text, Comment3By/Text
        const comments = [];
        for (let i = 1; i <= 3; i++) {
          const commentByKey = `Comment${i}By`;
          const commentTextKey = `Comment${i}Text`;
          const commentBy = row[commentByKey];
          const commentText = row[commentTextKey];
          
          if (commentBy && commentText) {
            // Try to find the commenter in accountsData to get their avatar
            const commenterData = accountsData.find(
              (acc) => acc["Handle"] === commentBy
            );
            const commenterAvatar = commenterData 
              ? await processAvatarUrl(commenterData["Photo (link)"], avatarsDir)
              : "/assets/users/default-avatar.jpg";
            
            comments.push({
              _id: "uuid()",
              text: commentText,
              username: commentBy,
              firstName: commenterData?.["Account name"] || commentBy,
              lastName: "",
              avatarURL: commenterAvatar,
              votes: { upvotedBy: [], downvotedBy: [] },
                createdAt: new Date(),
                updatedAt: "formatDate()"
            });
          }
        }
          

        let currentDate = new Date();

        // Create yesterday's date
        let previousDate = new Date(currentDate);
        previousDate.setDate(previousDate.getDate() - 1);

        // Copy only the time from row["Time"]
        if (row["Time"] instanceof Date) {
          previousDate.setHours(
            row["Time"].getHours(),
            row["Time"].getMinutes(),
            row["Time"].getSeconds(),
            row["Time"].getMilliseconds()
          );
        }

        // previousDate = yesterday with the time from row["Time"]
        return {
          _id: "uuid()",
          content: row["Text"] || "",
          type: "image",
          mediaUrl: await processAvatarUrl(row["Multimedia (link)"], postsDir),
          username: row["Handle"] || "",
          firstName: row["Account name"] || "",
          lastName: "",
          avatarURL: await processAvatarUrl(row["Photo (link)"], avatarsDir),
          createdAt: previousDate,
          updatedAt: "formatDate()",
          likes: {
              likeCount: row["Likes"] || 0,
          },
          comments: comments
        };
        
      }));


      // Create tmp folder if it does not exist and move file  `src/backend/db/posts_${lang}.jsx`if it exists into it (to avoid being overwritten by git) with a datetime suffix, then write new file
      
      const oldFilePosts = path.join(OUT_DIR, `src/backend/db/posts_${lang}.jsx`);
      if (fs.existsSync(oldFilePosts)) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const newFileName = `posts_${lang}_${timestamp}.jsx`;
        fs.renameSync(oldFilePosts, path.join(tmpDir, newFileName));
      }
      writeDbJsx(
        puzzle1Posts,
        `posts${langUpper}`,
        `src/backend/db/posts_${lang}.jsx`,
        [
          'import { v4 as uuid } from "uuid";',
          'import { formatDate } from "../utils/authUtils.jsx";',
          "",
          "/**",
          " *  Posts Database",
          " */",
          "",
        ]
      );
    }
  }

  // Puzzle 2 - AI Content
  console.log("\nProcessing Puzzle 2 (AI Content)...");
  const aiContent = {};

  for (const lang of langs) {
    const langUpper = lang.toUpperCase();
    const puzzle2SheetName = `Puzzle 2 ${langUpper}`;
    const puzzle2Data = readSheet(workbook, puzzle2SheetName);

    if (puzzle2Data.length > 0) {
      console.log(`  Processing ${lang}...`);

      // Group words by sentence number
      const sentencesMap = {};

      for (const row of puzzle2Data) {
        const sentenceNum = row["Sentence"];
        if (sentenceNum === undefined || sentenceNum === null) continue;

        if (!sentencesMap[sentenceNum]) {
          sentencesMap[sentenceNum] = { words: [], prompt: "" };
        }

        // Capture the prompt from the first row of each sentence (it's the same for all rows)
        if (row["Prompt"] && !sentencesMap[sentenceNum].prompt) {
          sentencesMap[sentenceNum].prompt = String(row["Prompt"]);
        }

        const word = {
          correct: row["Correct"] || row["Word"] || "",
          percentage: row["Percentage"] || "",
          alts: [row["Alt1"] || "", row["Alt2"] || ""].filter(Boolean),
        };

        sentencesMap[sentenceNum].words.push(word);
      }

      // Convert to array of sentences (sorted by sentence number)
      const sentenceNums = Object.keys(sentencesMap)
        .map(Number)
        .sort((a, b) => a - b);

      aiContent[lang] = sentenceNums.map((num) => sentencesMap[num]);
    }
  }

  // Write AIContent.json
  if (Object.keys(aiContent).length > 0) {
    const aiContentPath = path.join(OUT_DIR, "src/pages/AIContent/AIContent.json");
    // Backup existing file
    if (fs.existsSync(aiContentPath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      fs.copyFileSync(aiContentPath, path.join(tmpDir, `AIContent_${timestamp}.json`));
    }
    fs.writeFileSync(aiContentPath, JSON.stringify(aiContent, null, 2), "utf8");
    console.log(`Wrote AI Content to: src/pages/AIContent/AIContent.json`);
  }

  // Puzzle 3 - AI Incorrect Uses
  console.log("\nProcessing Puzzle 3 (AI Incorrect Uses)...");
  const aiIncorrectUses = {};

  for (const lang of langs) {
    const langUpper = lang.toUpperCase();
    const puzzle3SheetName = `Puzzle 3 ${langUpper}`;
    const puzzle3Data = readSheet(workbook, puzzle3SheetName);
    const puzzle3Sheet = workbook.getWorksheet(puzzle3SheetName);

    if (puzzle3Data.length > 0) {
      console.log(`  Processing ${lang}...`);
      console.log(`  Downloading Puzzle 3 images...`);

      // Resolve embedded images from Postimage/imagePreview column (if present)
      const embeddedPostImageByRow = {};
      const postImageColIdx = puzzle3Sheet ? getHeaderColumnIndex(puzzle3Sheet, "Postimage") : -1;
      const candidateCols = [postImageColIdx].filter((idx) => idx >= 0);

      if (puzzle3Sheet && candidateCols.length > 0) {
        for (const img of puzzle3Sheet.getImages()) {
          const rowIdx = img.range.tl.nativeRow; // 0-based row index
          const colIdx = img.range.tl.nativeCol; // 0-based col index
          if (candidateCols.includes(colIdx)) {
            const imageData = workbook.model.media[img.imageId];
            if (imageData) {
              const ext = imageData.extension || "png";
              const filename = `puzzle3_${lang}_${rowIdx}.${ext}`;
              const destPath = path.join(postsDir, filename);
              fs.writeFileSync(destPath, imageData.buffer);
              embeddedPostImageByRow[rowIdx] = `/assets/posts/${filename}`;
              console.log(`  Saved embedded Puzzle 3 post image: ${filename}`);
            }
          }
        }
      }

      aiIncorrectUses[lang] = await Promise.all(puzzle3Data.map(async (row, index) => ({
        id: `case-${index + 1}`,
        aiOk: parseAiOkValue(getRowValue(row, "AI OK?")),
        post: {
          name: getRowValue(row, "name") || "",
          handle: getRowValue(row, "handle") || "",
          date: getRowValue(row, "date") || "",
          image: await processAvatarUrl(getRowValue(row, "image"), avatarsDir),
          postImage: embeddedPostImageByRow[index + 1] || await processAvatarUrl(
            getRowValue(row, "Postimage"),
            postsDir
          ),
          text: getRowValue(row, "text") || "",
        },
        options: [
          {
            text: getRowValue(row, "Correct") || "",
            isCorrect: true,
          },
          {
            text: getRowValue(row, "Neutral") || "",
            isCorrect: false,
          },
          {
            text: getRowValue(row, "Incorrect") || "",
            isCorrect: false,
          },
        ],
      })));
    }
  }

  // Write AIIncorrectUses.json
  if (Object.keys(aiIncorrectUses).length > 0) {
    const aiIncorrectUsesPath = path.join(OUT_DIR, "src/pages/AIIncorrectUses/AIIncorrectUses.json");
    // Backup existing file
    if (fs.existsSync(aiIncorrectUsesPath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      fs.copyFileSync(aiIncorrectUsesPath, path.join(tmpDir, `AIIncorrectUses_${timestamp}.json`));
    }
    fs.writeFileSync(aiIncorrectUsesPath, JSON.stringify(aiIncorrectUses, null, 2), "utf8");
    console.log(`Wrote AI Incorrect Uses to: src/pages/AIIncorrectUses/AIIncorrectUses.json`);
  }

  // Final Challenge - Community Note Statements
  console.log("\nProcessing Final Challenge (Community Note Statements)...");
  const communityNoteStatements = {};

  for (const lang of langs) {
    const langUpper = lang.toUpperCase();
    const finalSheetName = `Final ${langUpper}`;
    const finalData = readSheet(workbook, finalSheetName);

    if (finalData.length > 0) {
      console.log(`  Processing ${lang}...`);

      communityNoteStatements[lang] = finalData.map((row, index) => {
        // Handle OK column - could be TRUE/FALSE string or boolean
        let isCorrect = false;
        const okValue = row["OK"];
        if (typeof okValue === "boolean") {
          isCorrect = okValue;
        } else if (typeof okValue === "string") {
          isCorrect = okValue.toUpperCase() === "TRUE";
        }

        return {
          id: index + 1,
          text: row["Text"] || "",
          correct: isCorrect,
          category: row["CATEGORY"] || row["Category"] || "",
        };
      });
    }
  }

  // Write CommunityNoteStatements.json
  if (Object.keys(communityNoteStatements).length > 0) {
    const communityNotePath = path.join(OUT_DIR, "src/pages/CommunityNote/CommunityNoteStatements.json");
    // Backup existing file
    if (fs.existsSync(communityNotePath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      fs.copyFileSync(communityNotePath, path.join(tmpDir, `CommunityNoteStatements_${timestamp}.json`));
    }
    fs.writeFileSync(communityNotePath, JSON.stringify(communityNoteStatements, null, 2), "utf8");
    console.log(`Wrote Community Note Statements to: src/pages/CommunityNote/CommunityNoteStatements.json`);
  }

  // Feed sheet
  console.log("\nProcessing Feed sheet...");
  const feedSheetData = readSheet(workbook, "Feed");
  const feedSheet = workbook.getWorksheet("Feed");

  if (feedSheetData.length > 0 && feedSheet) {
    // Create feed assets directory
    const feedDir = path.join(OUT_DIR, "public/assets/feed");
    if (!fs.existsSync(feedDir)) {
      fs.mkdirSync(feedDir, { recursive: true });
    }

    // Build a map: row index (1-based, data rows start at 2) → embedded image buffer
    // imageUser column is col index 4 (handle=1, firstName=2, lastName=3, imageUser=4)
    const embeddedImageByRow = {};
    const sheetImages = feedSheet.getImages();
    for (const img of sheetImages) {
      const rowIdx = img.range.tl.nativeRow; // 0-based row
      const colIdx = img.range.tl.nativeCol; // 0-based col
      if (colIdx === 3) { // imageUser is the 4th column (0-indexed = 3)
        const imageData = workbook.model.media[img.imageId];
        if (imageData) {
          embeddedImageByRow[rowIdx] = imageData;
        }
      }
    }

    // Save embedded images and build resolved paths
    const resolvedImageUsers = feedSheetData.map((row, idx) => {
      const rowIdx = idx + 1; // data starts at row index 1 (0-based), header is 0
      const imgData = embeddedImageByRow[rowIdx];
      if (imgData) {
        const ext = imgData.extension || "png";
        const filename = `feed_user${idx + 1}.${ext}`;
        const destPath = path.join(feedDir, filename);
        fs.writeFileSync(destPath, imgData.buffer);
        console.log(`  Saved embedded image: ${filename}`);
        return `/assets/feed/${filename}`;
      }
      // Fallback: if still a hyperlink object
      return "";
    });

    // Download feed post images
    console.log("  Downloading feed post images...");
    const resolvedImageURLs = await Promise.all(
      feedSheetData.map(async (row) => {
        const raw = await processAvatarUrl(row["imageURL"], feedDir);
        if (raw && typeof raw === "string") {
          return raw.replace("/assets/users/", "/assets/feed/");
        }
        return raw;
      })
    );

    const feedByLang = {};
    for (const lang of langs) {
      feedByLang[lang] = feedSheetData.map((row, idx) => ({
        handle: row["handle"] || "",
        firstName: row["firstName"] || "",
        lastName: row["lastName"] || "",
        imageUser: resolvedImageUsers[idx] || "",
        text: row[`text_${lang}`] || "",
        imageURL: resolvedImageURLs[idx] || "",
        date: row["date"] instanceof Date ? row["date"].toISOString() : (row["date"] || null),
        likes: row["likes"] != null && row["likes"] !== "" ? String(row["likes"]) : "0",
      }));
    }

    const feedDataPath = path.join(OUT_DIR, "src/pages/Home/FeedData.json");
    if (fs.existsSync(feedDataPath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      fs.copyFileSync(feedDataPath, path.join(tmpDir, `FeedData_${timestamp}.json`));
    }
    fs.writeFileSync(feedDataPath, JSON.stringify(feedByLang, null, 2), "utf8");
    console.log(`Wrote Feed data to: src/pages/Home/FeedData.json`);
  } else {
    console.warn("  Sheet 'Feed' not found or empty, skipping.");
  }

  // ECHO Official Account Posts (always visible, language-independent file)
  console.log("\nProcessing ECHO Official Account posts...");
  const echoPostsData = readSheet(workbook, "ECHO Profile Posts");

  if (echoPostsData.length > 0) {
    console.log(`  Found ${echoPostsData.length} ECHO post(s)`);
    console.log(`  Downloading ECHO post images...`);

    // Ensure postsDir exists
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    // Handle embedded images in the ECHO posts sheet (column index 0 = "image")
    const echoSheet = workbook.getWorksheet("ECHO Profile Posts");
    const embeddedEchoImages = {};
    if (echoSheet) {
      for (const img of echoSheet.getImages()) {
        const rowIdx = img.range.tl.nativeRow; // 0-based
        const colIdx = img.range.tl.nativeCol; // 0-based, image column = 0
        if (colIdx === 0) {
          const imageData = workbook.model.media[img.imageId];
          if (imageData) embeddedEchoImages[rowIdx] = imageData;
        }
      }
    }

    // Build multilingual officialAccount fields from the i18n sheet
    const officialNameRow = webI18n.find(row => String(row[keyColumn]) === "officialAccount.name");
    const officialHandleRow = webI18n.find(row => String(row[keyColumn]) === "officialAccount.handle");
    const officialBioRow = webI18n.find(row => String(row[keyColumn]) === "officialAccount.bio");
    const officialName = {};
    const officialHandle = {};
    const officialBio = {};
    for (const lang of langs) {
      officialName[lang] = officialNameRow?.[lang] || "ECHO";
      officialHandle[lang] = officialHandleRow?.[lang] || "@ECHO";
      officialBio[lang] = officialBioRow?.[lang] || "";
    }
    const echoPosts = await Promise.all(echoPostsData.map(async (row, idx) => {
      // Try embedded image first (rowIdx for data rows starts at 1, header is 0)
      let mediaUrl = "";
      const embeddedImg = embeddedEchoImages[idx + 1];
      if (embeddedImg) {
        const ext = embeddedImg.extension || "png";
        const filename = `echo_post${idx + 1}.${ext}`;
        const destPath = path.join(postsDir, filename);
        fs.writeFileSync(destPath, embeddedImg.buffer);
        console.log(`  Saved embedded ECHO post image: ${filename}`);
        mediaUrl = `/assets/posts/${filename}`;
      } else {
        mediaUrl = await processAvatarUrl(row["image"], postsDir);
      }
      return {
        _id: "uuid()",
        content: {
          es: row["text_es"] || "",
          en: row["text_en"] || "",
          fi: row["text_fi"] || "",
          sr: row["text_sr"] || "",
        },
        type: "image",
        mediaUrl,
        username: "ECHO",
        firstName: officialName,
        lastName: "",
        avatarURL: "/assets/echo-logo-bg.png",
        createdAt: row["date"] ? new Date(row["date"]) : new Date(),
        updatedAt: "formatDate()",
        likes: {
          likeCount: row["likes"] || 0,
        },
      };
    }));

    const oldFileEcho = path.join(OUT_DIR, "src/backend/db/posts_echo.jsx");
    if (fs.existsSync(oldFileEcho)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      fs.renameSync(oldFileEcho, path.join(tmpDir, `posts_echo_${timestamp}.jsx`));
    }
    writeDbJsx(
      echoPosts,
      "postsECHO",
      "src/backend/db/posts_echo.jsx",
      [
        'import { v4 as uuid } from "uuid";',
        'import { formatDate } from "../utils/authUtils.jsx";',
        "",
        "/**",
        " *  ECHO Official Account Posts (always visible, multilingual content)",
        " */",
        "",
      ]
    );
  } else {
    console.warn("  Sheet 'ECHO posts' not found or empty, skipping.");
  }

  // App Hints sheet
  console.log("\nProcessing App Hints sheet...");
  const pistasSheetData = readSheet(workbook, "App Hints");

  if (pistasSheetData.length > 0) {
    console.log(`  Found ${pistasSheetData.length} hint(s)`);

    const hintsResult = {};
    for (const lang of langs) {
      hintsResult[lang] = {};
      for (const row of pistasSheetData) {
        const puzzleId = String(row["puzzle_id"] ?? "").trim();
        if (!puzzleId) continue;
        if (!hintsResult[lang][puzzleId]) hintsResult[lang][puzzleId] = [];
        hintsResult[lang][puzzleId].push({
          context: row[`context_${lang}`] || "",
          clue: row[`clue_${lang}`] || "",
        });
      }
    }

    const hintsDataPath = path.join(OUT_DIR, "src/components/HintsApp/HintsData.json");
    const hintsDir = path.dirname(hintsDataPath);
    if (!fs.existsSync(hintsDir)) fs.mkdirSync(hintsDir, { recursive: true });
    if (fs.existsSync(hintsDataPath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      fs.copyFileSync(hintsDataPath, path.join(tmpDir, `HintsData_${timestamp}.json`));
    }
    fs.writeFileSync(hintsDataPath, JSON.stringify(hintsResult, null, 2), "utf8");
    console.log(`  Wrote hints data to: src/components/HintsApp/HintsData.json`);
  } else {
    console.warn("  Sheet 'App Pistas' not found or empty, skipping.");
  }

  console.log("\nDone!");
}

// Run the main function
main().catch(console.error);