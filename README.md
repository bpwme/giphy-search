## Setup
1. Copy `.env.example` to `.env` and fill in your key. https://developers.giphy.com/dashboard/?create=true
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```
## Bugs
- Whenever the search suggestions get updated, the results get refetched too. This shouldn't be the case, but due to inexperience with TanStack I haven't managed to fix it yet. (or maybe it's due to v-model, not sure)

## Notes
- Styling (+responsive) is terrible :P
- Gifs are current;y limited to 8 per fetch to prevent getting rate limited all the time
- In a bigger project I would separate components even further. E.g. a new Button.vue component.
- No keyboard support (submit on enter, arrow navigation in list)
- Code formatter wasn't cooporating so the code is a bit messy (especially in templates)