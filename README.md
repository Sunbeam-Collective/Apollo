![Apollo-Landing-Page](/assets/banner.png)

Apollo is for music enthusiasts who love to tweak their favorite songs. It allows users to adjust the speed and pitch of songs as well as share their unique mixes with the world.

# Why Apollo?
Apollo is made for people who love diving deep into their music. Want to slow down a track to catch every detail or speed it up to match your energy? Need to shift the pitch to suit your voice or just explore how different it can sound? Apollo makes it easy with precise controls for both speed and pitch. And the best part—you can share your custom mixes with others or discover what the community is creating. It’s not just about listening anymore—it’s about making the music your own.


# 🚀 How It Works
🎶 Browse Music Snippets
Tap into a huge catalog of music clips, powered by the Deezer API—no digging required.

▶️ Play It Your Way
Use Apollo’s built-in player to instantly preview any snippet with smooth, responsive controls.

⏩ Tweak the Tempo
Speed it up or slow it down in real time. Perfect for practicing, remixing, or just vibing at your own pace.

💾 Download Your Mix
Like what you made? Save your custom version and take it with you—anytime, anywhere.

# 🎵 Key Features of Apollo
🎚️ Speed Control
Adjust the tempo of any song with smooth, real-time controls. Whether you're slowing things down to learn a solo, practicing choreography, or just want to chill to a slower vibe, Apollo gives you accurate tempo adjustment without messing up the sound quality.

🎵 Pitch Shifting
Change the pitch up or down while keeping the song in sync. Great for singers trying different keys, DJs creating new versions, or just experimenting with how your favorite tracks sound in a whole new tone. No chipmunk voices or distorted bass—Apollo uses high-quality processing to keep everything crisp.

📥 Download Your Mix
Made something cool? Save your customized mix directly to your device. Whether it’s a slowed-down version, a pitch-shifted take, or anything in between, Apollo lets you export your creation locally—so you can listen offline, use it in projects, or just keep it for yourself.

📱 Sleek, Intuitive Interface
Apollo is designed to feel powerful but lightweight. Everything’s right where you expect it, so you can focus on playing with your sound, not figuring out how the app works.

# Why OKLCH and APCA?
OKLCH, currently the most perceptually accurate color model, provides consistent perceptual chroma and lightness, making your colors feel “right” across all levels and hues.
APCA is a modern contrast formula optimized for self-illuminated displays, better reflecting how users perceive contrast on screens.
APCACH, our own custom calculator that blends these two technologies to generate balanced and accessible colors.
Technical details
This project is a monorepo managed with PNPM, consisting of a core package and two targets: a web application and a Figma plugin.

## Monorepo Structure
packages/core: Contains the main application code shared between different targets.
packages/web: The web application target.
packages/figma-plugin: The Figma plugin target.

## Available PNPM Commands
The following PNPM commands are available for working with the repository:

pnpm install: Installs all dependencies.
pnpm web <sub-command>: It is the alias for running commands for the web target from the root. Available sub-commands: dev, build and preview.
pnpm figma <sub-command>: It is the alias for running commands for the figma plugin target from the root. Available sub-commands: dev, build.
pnpm lint: Runs the linter.
pnpm format: Runs formatters
pnpm typecheck: Runs typechecking

# Store
The application's state management is built on the Spred reactive library and its React bingings. All the domain logic are written using signals or derivations and can be found in packages/core/src/stores directory.

# Color Calculation in Web Workers
To ensure a smooth user experience, the color palette calculation logic is performed in a web worker. This prevents the main thread from being blocked, especially during complex calculations, resulting in a more responsive UI.

# Main Container and CSS Variables
The main container element of the application defines a set of CSS variables that control the overall look and feel. Dynamic styles are calculated based on the application's state and applied to these CSS variables, allowing using it everywhere in the app from CSS.
