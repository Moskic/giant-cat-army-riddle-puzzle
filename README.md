# Giant Cat Army Riddle Puzzle

A lightweight browser game inspired by the TED-Ed video [Can you solve the giant cat army riddle?](https://youtu.be/YeMVoJKn1Tg) by Dan Finkel.

## Rules

The display starts at `0`. You can use only three operations:

- Add 5
- Add 7
- Take the square root

The goal is to reach `2`, `10`, and `14` in that order. The game ends immediately if a number repeats, exceeds `60`, or is not a whole number. The initial value `0` counts as already visited.

## Running the Game

Open `index.html` directly in a modern browser. The project uses no frameworks, build tools, network requests, or third-party dependencies. It can also be deployed to any static hosting service.

## Project Structure

- `index.html`: Semantic page structure
- `style.css`: Responsive interface styles
- `app.js`: Game state, rule validation, move history, and Chinese/English localization

The interface selects Chinese or English based on the browser language. You can switch languages with the button in the upper-right corner, and the preference is saved locally in the browser.
