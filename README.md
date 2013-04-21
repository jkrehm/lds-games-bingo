# LDS Games
## *Bingo*

Simple bingo game for use during General Conference, fast & testimony meeting, or whenever you're having a hard time paying attention during church.

### Features
- Two settings: 3x3 and 5x5 grid (7x7 coming in the future).
- Provides a printer-friendly version.
- Saves progress as you play (using browser's local storage).
- Declares bingo, but lets you play as long as you want.
- Written using only HTML, CSS, and Javascript (no server-side functionality required).

### Setup
- Run via a web server (or upload to [Amazon S3](https://console.aws.amazon.com/s3/home): that's what I do). You cannot just run it locally because it uses ajax to get the bingo cards JSON file (and browsers have that function disabled by default when running locally).
- Add cards by adding a node to bingo.json and place the associated image in the img/bingo directory.

Check out the playable version at [lds.rehm.me/games/bingo](http://lds.rehm.me/games/bingo).

### TODO
- Fix style so it doesn't wrap the last column in 5x5 when playing on a phone.