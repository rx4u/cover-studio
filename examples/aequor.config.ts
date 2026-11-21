// Proof config for a real site. Photo-led page, so a neutral ground.
export default {
  name: "aequor",
  extends: "neutral-light",
  source: {
    url: "https://aequor-estate.vercel.app",
    pages: ["/", "/houses/headland"],
    scrollPositions: [0, 1800],
    photo: "img",
  },
};
