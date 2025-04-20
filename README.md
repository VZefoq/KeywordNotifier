# KeywordNotifier

**KeywordNotifier** is a BetterDiscord plugin that sends you notifications whenever specific keywords appear in selected Discord channels or servers. You can customize the keywords you're tracking and choose which servers or channels to monitor. The plugin also plays a sound notification when a match is found.

## Features:
- Notify you when specific keywords are mentioned (like `DD`, `XZ`, `Dragon`, etc.)
- Play a sound notification when a keyword is detected
- Simple and clean configuration menu to manage keywords, server IDs, and channel IDs
- Ignore messages containing "NOT DD" or "NO DD" to avoid false positives

## Installation:

1. Make sure you have **BetterDiscord** installed.
2. Download the `KeywordNotifier.plugin.js` file from the [releases page](link).
3. Place the file in the `plugins` folder of your BetterDiscord directory.
4. Reload Discord, and the plugin should be active.
5. Open the settings from the BetterDiscord plugin menu to configure your keywords, servers, and channels.

## Configuration:
- **Keywords**: Add your keywords separated by commas (e.g., `DD, XZ, Dragon`).
- **Servers**: Enter the server IDs you want to monitor. Leave blank to monitor all servers.
- **Channels**: Enter the channel IDs you want to monitor. Leave blank to monitor all channels.

## Example:
If you want to track `DD`, `XZ`, and `Dragon` in any channel of your server, you would configure it as:
- **Keywords**: `DD, XZ, Dragon`
- **Servers**: Leave it empty for all servers.
- **Channels**: Leave it empty for all channels.

## Notes:
- The plugin is case-insensitive and works with all text formats (e.g., `DD`, `dd`, `Dd`).
- It ignores phrases like `NOT DD` or `NO DD` to prevent false notifications.

## License:
This project is licensed under the MIT License.

---

If you have any questions or issues, feel free to open an issue on the [GitHub repo](https://github.com/VZefoq/KeywordNotifier/issues)!
