const SB_BASE = "https://raw.githubusercontent.com/statsbomb/open-data/master/data";

interface RawEvent {
  id: string;
  index: number;
  period: number;
  minute: number;
  second: number;
  type: { id: number; name: string };
  team: { id: number; name: string };
  player?: { id: number; name: string };
  location?: [number, number];
  shot?: {
    statsbomb_xg: number;
    outcome: { id: number; name: string };
    technique: { name: string };
    body_part: { name: string };
    end_location: [number, number];
  };
  pass?: {
    length: number;
    angle: number;
    end_location: [number, number];
    outcome?: { name: string };
    shot_assist?: boolean;
    goal_assist?: boolean;
  };
}

export default defineEventHandler(async (event) => {
  const { match_id } = getRouterParams(event);

  const raw = await $fetch<RawEvent[] | unknown>(
    `${SB_BASE}/events/${match_id}.json`,
    { parseResponse: (txt) => JSON.parse(txt) },
  );
  const events = (Array.isArray(raw) ? raw : Object.values(raw)) as RawEvent[];

  const shots = events
    .filter((e) => e.type.name === "Shot")
    .map((e) => ({
      id: e.id,
      minute: e.minute,
      second: e.second,
      period: e.period,
      team: e.team.name,
      player: e.player?.name ?? "",
      location: e.location!,
      xg: e.shot!.statsbomb_xg,
      outcome: e.shot!.outcome.name,
      technique: e.shot!.technique.name,
      bodyPart: e.shot!.body_part.name,
      endLocation: e.shot!.end_location,
    }));

  const passes = events
    .filter((e) => e.type.name === "Pass" && e.location && e.pass?.end_location)
    .map((e) => ({
      id: e.id,
      team: e.team.name,
      player: e.player?.name ?? "",
      location: e.location!,
      endLocation: e.pass!.end_location,
      length: e.pass!.length,
      outcome: e.pass?.outcome?.name ?? "Complete",
      shotAssist: e.pass?.shot_assist ?? false,
      goalAssist: e.pass?.goal_assist ?? false,
    }));

  const teamNames = [...new Set(events.map((e) => e.team.name))];

  return { shots, passes, teamNames };
});
