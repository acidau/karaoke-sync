# Karaoke Sync

Follow-along karaoke lyrics for your phone. Load a song from [kara.moe](https://kara.moe/), then tap a word the moment it's sung on the karaoke machine. The page highlights each syllable in time from there, without needing the video.

## Features

- **Load songs from kara.moe** by pasting a song page link, choosing the `.ass` lyrics file, or pasting the song data.
- **Tap a word to sync.** Highlighting jumps to that word and carries on, with auto-scroll and lead-in dots before each line.
- **Tap tempo.** Tap the beat 4+ times to set the base tempo, then tap again during the song to speed up or slow down to match the machine.
- **Type BPM.** Enter the song's BPM and the machine's current BPM directly.
- **Saved per song.** Tempo is saved in the browser's local storage, keyed by song.
- **Fine control.** ±0.25 s nudge buttons and ± BPM buttons.
- Keyboard: Space play/pause, B tap beat, ←/→ nudge, `[` `]` tempo.

## Using it

Open `index.html` in a browser, or host it on any static host (e.g. GitHub Pages). When hosted on a normal web page, loading by kara.moe link fetches directly from `https://kara.moe/api/karas/<id>`.

## Project layout

| Path | What it is |
| --- | --- |
| `index.html` | The page and its source. Edit this. Bootstrap 4.6.2 CSS is inlined, so it works on GitHub Pages without a build step. |
| `build.mjs` | Copies the `<body>` of `index.html` to `build/artifact.html`. |
| `build/artifact.html` | Body-only page for publishing as a Claude artifact (not committed). |

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
