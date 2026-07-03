import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import type { Resource, ResourceVehicle } from "../src/types/resource.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RESOURCES_PATH = path.join(ROOT, "src/data/resources.json");
const LOGO_PATH = path.join(ROOT, "public/images/logo.png");
const TEMP_DIR = path.join(ROOT, "temp/delga");
const OUTPUT_DIR = path.join(ROOT, "public/videos/delga");

const CHANNEL =
  process.env.DELGA_YOUTUBE_CHANNEL?.replace(/^@/, "") ?? "delga2000ca";
const CHANNEL_CANDIDATES = [
  `https://www.youtube.com/@${CHANNEL}/videos`,
  `https://www.youtube.com/@${CHANNEL}/shorts`,
  `https://www.youtube.com/@${CHANNEL}`,
];
const LIMIT = Number(process.env.SYNC_VIDEO_LIMIT ?? "20");
const DRY_RUN = process.argv.includes("--dry-run");
const FFMPEG = process.env.FFMPEG_PATH ?? "ffmpeg";
const YTDLP = process.env.YTDLP_PATH ?? resolveYtDlp();

interface YtVideoMeta {
  id: string;
  title: string;
  description?: string;
  upload_date?: string;
  webpage_url?: string;
}

function resolveYtDlp(): string {
  const candidates = ["yt-dlp", "yt-dlp.exe"];
  for (const cmd of candidates) {
    const result = spawnSync(cmd, ["--version"], { encoding: "utf-8" });
    if (result.status === 0) return cmd;
  }
  const pythonResult = spawnSync("python", ["-m", "yt_dlp", "--version"], {
    encoding: "utf-8",
  });
  if (pythonResult.status === 0) return "python -m yt_dlp";
  throw new Error(
    "yt-dlp no encontrado. Instale con: pip install yt-dlp  o  winget install yt-dlp"
  );
}

function runCommand(command: string, args: string[]): void {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    cwd: ROOT,
  });
  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
}

function runYtDlp(args: string[]): string {
  const isPythonModule = YTDLP.includes("python");
  const command = isPythonModule ? "python" : YTDLP;
  const fullArgs = isPythonModule ? ["-m", "yt_dlp", ...args] : args;

  const result = spawnSync(command, fullArgs, {
    encoding: "utf-8",
    cwd: ROOT,
    maxBuffer: 50 * 1024 * 1024,
  });
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || "yt-dlp failed");
  }
  return result.stdout;
}

function slugify(title: string, videoId: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return `${base}-${videoId.slice(-6)}`;
}

function detectVehicle(text: string): ResourceVehicle {
  const lower = text.toLowerCase();
  if (/\bstarex\b|\bh-1\b|\bgrand starex\b/.test(lower)) return "starex";
  if (/\bstaria\b/.test(lower)) return "staria";
  if (/\bporter\b|\bh100\b/.test(lower)) return "porter";
  if (/\bbongo\b|\bkia\b/.test(lower)) return "bongo";
  return "all";
}

function parseUploadDate(uploadDate?: string): string {
  if (!uploadDate || uploadDate.length !== 8) return new Date().toISOString();
  const year = uploadDate.slice(0, 4);
  const month = uploadDate.slice(4, 6);
  const day = uploadDate.slice(6, 8);
  return new Date(`${year}-${month}-${day}T12:00:00.000Z`).toISOString();
}

function truncate(text: string, max = 200): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function checkFfmpeg(): void {
  const result = spawnSync(FFMPEG, ["-version"], { encoding: "utf-8" });
  if (result.status !== 0) {
    throw new Error("ffmpeg no encontrado. Instale FFmpeg y agregue al PATH.");
  }
}

function fetchChannelVideos(): YtVideoMeta[] {
  let lastError: Error | null = null;

  for (const channelUrl of CHANNEL_CANDIDATES) {
    try {
      console.log(`Fetching metadata from ${channelUrl} (limit ${LIMIT})...`);
      const output = runYtDlp([
        "--playlist-end",
        String(LIMIT),
        "-j",
        "--skip-download",
        "--ignore-errors",
        channelUrl,
      ]);

      const videos = output
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => JSON.parse(line) as YtVideoMeta)
        .filter((meta) => meta.id && meta.title);

      if (videos.length > 0) {
        console.log(`Using ${videos.length} videos from ${channelUrl}`);
        return videos;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Skipped ${channelUrl}: ${lastError.message}`);
    }
  }

  throw lastError ?? new Error("No videos found on channel");
}

function downloadVideo(videoId: string): string {
  ensureDir(TEMP_DIR);
  const outputTemplate = path.join("temp", "delga", `${videoId}.%(ext)s`);
  const url = `https://www.youtube.com/shorts/${videoId}`;
  const baseArgs = [
    "--merge-output-format",
    "mp4",
    "--extractor-args",
    "youtube:player_client=android,web",
    "--sleep-interval",
    "2",
    "--retries",
    "5",
    "-o",
    outputTemplate,
  ];
  const formats = [
    "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
    "best[ext=mp4]/best",
    "best",
  ];

  let lastError: Error | null = null;
  for (const format of formats) {
    try {
      runYtDlp(["-f", format, ...baseArgs, url]);
      lastError = null;
      break;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  if (lastError) throw lastError;

  const files = fs.readdirSync(TEMP_DIR).filter((file) => file.startsWith(videoId));
  const mp4 = files.find((file) => file.endsWith(".mp4"));
  if (!mp4) throw new Error(`Download failed for ${videoId}`);
  return path.join(TEMP_DIR, mp4);
}

function overlayLogo(inputPath: string, outputPath: string): void {
  ensureDir(path.dirname(outputPath));
  runCommand(FFMPEG, [
    "-y",
    "-i",
    inputPath,
    "-i",
    LOGO_PATH,
    "-filter_complex",
    "[1:v]scale=120:-1[logo];[0:v][logo]overlay=24:24",
    "-c:v",
    "libx264",
    "-crf",
    "23",
    "-preset",
    "medium",
    "-c:a",
    "aac",
    "-movflags",
    "+faststart",
    outputPath,
  ]);
}

function createPoster(videoPath: string, posterPath: string): void {
  runCommand(FFMPEG, [
    "-y",
    "-ss",
    "00:00:01",
    "-i",
    videoPath,
    "-frames:v",
    "1",
    "-update",
    "1",
    "-q:v",
    "2",
    posterPath,
  ]);
}

async function uploadToBlob(filePath: string, blobPath: string): Promise<string | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;

  const body = fs.readFileSync(filePath);
  const contentType = blobPath.endsWith(".mp4") ? "video/mp4" : "image/jpeg";

  const response = await fetch(
    `https://blob.vercel-storage.com/${encodeURIComponent(blobPath)}`,
    {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": contentType,
        "x-add-random-suffix": "0",
      },
      body,
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Blob upload failed: ${response.status} ${text}`);
  }

  const data = (await response.json()) as { url: string };
  return data.url;
}

async function resolveMediaUrls(
  videoId: string,
  localVideoPath: string,
  localPosterPath: string
): Promise<{ videoSrc: string; posterSrc: string }> {
  const blobVideo = await uploadToBlob(localVideoPath, `delga/${videoId}.mp4`);
  const blobPoster = await uploadToBlob(localPosterPath, `delga/${videoId}.jpg`);

  return {
    videoSrc: blobVideo ?? `/videos/delga/${videoId}.mp4`,
    posterSrc: blobPoster ?? `/videos/delga/${videoId}.jpg`,
  };
}

function loadResources(): Resource[] {
  return JSON.parse(fs.readFileSync(RESOURCES_PATH, "utf-8")) as Resource[];
}

function saveResources(resources: Resource[]): void {
  fs.writeFileSync(RESOURCES_PATH, `${JSON.stringify(resources, null, 2)}\n`, "utf-8");
}

function buildResourceFromMeta(
  meta: YtVideoMeta,
  media: { videoSrc: string; posterSrc: string },
  featured: boolean
): Resource {
  const slug = slugify(meta.title, meta.id);
  const vehicle = detectVehicle(`${meta.title} ${meta.description ?? ""}`);
  const tags = ["delga2000ca", "video"];
  if (vehicle !== "all") tags.push(vehicle);

  return {
    id: `delga-${meta.id}`,
    slug,
    type: "video",
    title: meta.title.trim(),
    description: truncate(meta.description ?? meta.title),
    vehicle,
    url: `https://junubadiesel.com/recursos/${slug}`,
    youtubeId: meta.id,
    videoSrc: media.videoSrc,
    posterSrc: media.posterSrc,
    sourceChannel: "delga2000ca",
    sourceUrl: meta.webpage_url ?? `https://www.youtube.com/shorts/${meta.id}`,
    tags,
    publishedAt: parseUploadDate(meta.upload_date),
    featured,
  };
}

async function main() {
  if (!fs.existsSync(LOGO_PATH)) {
    throw new Error(`Logo not found at ${LOGO_PATH}`);
  }

  const videos = fetchChannelVideos();
  console.log(`Found ${videos.length} videos.`);

  if (DRY_RUN) {
    for (const [index, meta] of videos.entries()) {
      console.log(
        `${index + 1}. [${meta.id}] ${meta.title} → slug: ${slugify(meta.title, meta.id)}`
      );
    }
    return;
  }

  checkFfmpeg();
  ensureDir(OUTPUT_DIR);

  const existing = loadResources().filter(
    (resource) => resource.sourceChannel !== "delga2000ca" && resource.id !== "res-6"
  );

  const delgaResources: Resource[] = [];
  const failures: string[] = [];

  for (const [index, meta] of videos.entries()) {
    console.log(`\nProcessing (${index + 1}/${videos.length}): ${meta.title}`);
    const localVideoPath = path.join(OUTPUT_DIR, `${meta.id}.mp4`);
    const localPosterPath = path.join(OUTPUT_DIR, `${meta.id}.jpg`);

    try {
      if (!fs.existsSync(localVideoPath)) {
        const downloaded = downloadVideo(meta.id);
        overlayLogo(downloaded, localVideoPath);
      } else {
        console.log("  Skipping encode — output already exists");
      }

      if (!fs.existsSync(localPosterPath)) {
        createPoster(localVideoPath, localPosterPath);
      }

      const media = await resolveMediaUrls(meta.id, localVideoPath, localPosterPath);
      delgaResources.push(buildResourceFromMeta(meta, media, index < 6));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(`${meta.id}: ${message}`);
      console.error(`  Failed: ${message}`);
    }
  }

  if (delgaResources.length === 0) {
    throw new Error(`No videos processed. Failures:\n${failures.join("\n")}`);
  }

  const merged = [...delgaResources, ...existing].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );

  saveResources(merged);
  console.log(`\nDone. ${delgaResources.length} Delga videos synced to ${RESOURCES_PATH}`);
  if (failures.length > 0) {
    console.warn(`\n${failures.length} videos failed:\n${failures.join("\n")}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
