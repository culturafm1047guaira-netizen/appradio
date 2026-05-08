# Audio Management: Rádio Cultura FM 104.7

## Stream Configuration
- **Source**: ICEcast / Shoutcast stream.
- **Format**: MP3 / AAC (MIME: audio/mpeg or audio/aac).

## Error Handling
- **Timeout**: Attempt to reconnect after 5 seconds of lost connection.
- **Buffering**: Show loading state (spinner/pulse) when `readyState < 3`.
- **Interruption**: Handle `AudioContext` suspension and resume on user interaction.

## Playback Behavior
- **Volume**: Default at 80%. Smooth ramp up on start.
- **Auto-play**: Disabled (browser policy). Require user gesture.
- **Persistence**: Playback continues across internal page navigations (handled via React state/context).
