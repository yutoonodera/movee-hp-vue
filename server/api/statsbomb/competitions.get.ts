const SB_BASE = "https://raw.githubusercontent.com/statsbomb/open-data/master/data";

const FEATURED = [
  { competition_id: 11, season_id: 27, label: "La Liga 2015/16" },
  { competition_id: 11, season_id: 90, label: "La Liga 2020/21" },
  { competition_id: 16, season_id: 4,  label: "Champions League 2018/19" },
  { competition_id: 43, season_id: 106, label: "FIFA World Cup 2022" },
  { competition_id: 43, season_id: 3,   label: "FIFA World Cup 2018" },
];

export default defineEventHandler(async () => {
  return FEATURED;
});
