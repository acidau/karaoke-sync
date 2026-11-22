# Karaoke Sync

Follow-along karaoke lyrics for your phone. Load a song from [kara.moe](https://kara.moe/), then tap a word the moment it's sung on the karaoke machine. The page highlights each syllable in time from there, without needing the video.

## Features

- **Load songs from kara.moe** by pasting a song page link, choosing the `.ass` lyrics file, or pasting the song data.
- **Your songs.** Every song you load is saved on this device and listed at the top of **Load song**, newest first, so you can reopen it without the link or file. Pin a song to keep it at the top (pinned songs are A–Z and never dropped). Up to 30 unpinned songs are kept; when the browser's storage is full, the oldest unpinned songs go first. Remove a song with ×; unpin it first if it's pinned.
- **Tap a word to sync.** Highlighting jumps to that word and carries on, with auto-scroll and lead-in dots before each line.
- **Tempo from word taps.** Each time you tap a later word as it's sung, the speed is worked out from your last 3 word taps (2 to begin with) and set automatically. Taps need at least 1.5 s between the first and last. Tapping the same word again corrects the last tap; tapping an earlier word, or waiting over a minute, starts afresh. **Reset tempo** puts it back to 1.00× and clears the taps.
- **Tap tempo.** Tap the beat 4+ times to set the base tempo, then tap again during the song to speed up or slow down to match the machine.
- **Listen for the tempo.** Tap **Listen** and the phone's microphone follows the machine's beat, speeding the lyrics up or slowing them down to match (within 0.5–1.5× of the base tempo). With no base tempo yet, the first steady beat it hears becomes the base. It needs a few seconds of steady beat, reacts to a tempo change in about 7 seconds, and pauses for 8 seconds after you change the tempo by hand. Runs entirely on the phone; nothing is recorded or sent anywhere. Needs the page on https (GitHub Pages is fine).
- **Follow lyrics (Vercel version only).** Tap **Follow lyrics** and the phone listens to the singing, works out where in the lyrics it is, and keeps the highlighting there. The last 8 seconds of microphone audio are sent to a small server function (`api/transcribe.js`) that passes them to Whisper; nothing is kept. It sends a clip every 5 seconds while finding its place and every 10 seconds once following. A word you tap always wins for the next few seconds. Lyrics in romaji or English match best; if Whisper hears Japanese it writes kana (converted to romaji here) and kanji (which can't be matched, so fewer words count).
- **Type BPM.** Enter the song's BPM and the machine's current BPM directly.
- **Saved per song.** Tempo is saved in the browser's local storage, keyed by song.
- **Fine control.** ±0.25 s nudge buttons and ± BPM buttons.
- Keyboard: Space play/pause, B tap beat, ←/→ nudge, `[` `]` tempo, L listen.

## Using it

Open `index.html` in a browser, or host it on any static host (e.g. GitHub Pages). When hosted on a normal web page, loading by kara.moe link fetches directly from `https://kara.moe/api/karas/<id>`.

## Project layout

| Path | What it is |
| --- | --- |
| `index.html` | The page and its source. Edit this. Bootstrap 4.6.2 CSS is inlined, so it works on GitHub Pages without a build step. |
| `build.mjs` | Copies the `<body>` of `index.html` to `build/artifact.html`. |
| `build/artifact.html` | Body-only page for publishing as a Claude artifact (not committed). |
| `vercel.json` | Vercel settings: copies `index.html` into `dist/` and serves that. GitHub Pages ignores it. |
| `api/transcribe.js` | Vercel function for **Follow lyrics**: forwards an audio clip to Whisper and returns the words with timings. |

## Setting up Follow lyrics on Vercel

1. Get an API key from [Groq](https://console.groq.com/keys) (it runs Whisper `whisper-large-v3-turbo`).
2. In the Vercel project: **Settings → Environment Variables**, add `GROQ_API_KEY` with the key, then redeploy.
3. Open the Vercel address on your phone and tap **Follow lyrics**.

Cost: Groq bills at least 10 seconds of audio per clip, at $0.04 per hour of audio, so a 4-minute song costs about 1 cent. Its rate limits (20 requests a minute, 7,200 audio-seconds an hour, shared by everyone using your deployment) allow roughly one phone following at a time; when they're hit, the page waits and retries. Each clip is about 256 KB, so following uses roughly 1.5–3 MB of mobile data a minute.

To use another OpenAI-compatible Whisper service instead, set `TRANSCRIBE_API_KEY`, `TRANSCRIBE_BASE_URL` and `TRANSCRIBE_MODEL`. The function only accepts requests from pages on its own site, which stops other websites using your key from a browser; to guard against scripted abuse, add a rate limit rule for `/api/transcribe` in Vercel's Firewall.

## Building

Only needed for the Claude artifact version. There are no dependencies to install.

```sh
npm run build
```

## Credits

This page is compatible with the [kara.moe](https://kara.moe/) project. Karaoke Mugen Server is under the [MIT License](https://gitlab.com/karaokemugen/code/karaokemugen-server/-/blob/main/LICENSE.md). Song lyrics come from the [Karaoke Mugen database](https://gitlab.com/karaokemugen/bases/karaokebase), which has its own licence.

Built with [Bootstrap 4.6.2](https://getbootstrap.com/docs/4.6/) (MIT).

## Licence

MIT. See [LICENSE](LICENSE).
