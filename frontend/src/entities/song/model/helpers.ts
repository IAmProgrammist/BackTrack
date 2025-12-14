export const msToMMSS = (duration?: number | null) => {
    if (!duration) {
        return "--:--"
    }

    const minutes = Math.floor(duration / 1000 / 60).toString();
    const seconds = Math.floor(duration / 1000 % 60).toString();

    return `${minutes}:${seconds.length < 2 ? "0" : seconds.substring(0, 1)}${seconds.length >= 2 ? seconds.substring(1, 2) : seconds}`;
}