Just a quick snake game done in 1 day. I'm rendering everything on `<canvas>` element without any 2D drawing library. 

Unplayable on mobile, sorry :(

## Requires

- Webpack for building
- `webpack-dev-server` for autoreload goodness

## Play now

Here: https://www.darekgreenly.com/pub/snake-game

use `W`, `S`, `A`, `D` to control the snake. `ENTER` to start/restart the game.

## Commands

`npm run stars` - runs webpack dev server, so it'll rebuild your code everytime you change anything and start server at `localhost:8080` with auto-reload
`npm run build` - runs webpack to actually build the code and place it in /dist folder
