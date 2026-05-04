export const playerStates = ["playing", "paused"] as const
export const playlistOrderStates = ["default", "repeat", "shuffle"] as const
export const trackOrderStates = ["default", "repeat"] as const

export type PlayerState = typeof playerStates[number]
export type PlaylistOrderState = typeof playlistOrderStates[number]
export type TrackOrderState = typeof trackOrderStates[number]