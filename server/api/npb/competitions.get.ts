export default defineCachedEventHandler(async () => {
  return [
    { id: "npb-2026", label: "NPB 2026", season: "2026" },
    { id: "npb-2025", label: "NPB 2025", season: "2025" },
    { id: "npb-2024", label: "NPB 2024", season: "2024" },
    { id: "npb-2023", label: "NPB 2023", season: "2023" },
  ];
}, { maxAge: 60 * 60, name: "npb-competitions" });
