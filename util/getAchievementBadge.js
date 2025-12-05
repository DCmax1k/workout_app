const badges = {
  // badge icons
  starter: require("../assets/badgeIcons/00starter.png"),
  riser: require("../assets/badgeIcons/10riser.png"),
  warrior: require("../assets/badgeIcons/20warrior.png"),
  champion: require("../assets/badgeIcons/30champion.png"),
  legend: require("../assets/badgeIcons/40legend.png"),
  titan: require("../assets/badgeIcons/50titan.png"),
}

const getAchievementBadge = (totalWorkouts) => {
  if (!totalWorkouts) return null;

  if (totalWorkouts >= 1000) {
    return {icon: badges.titan, key: "titan", };
  } else if (totalWorkouts >= 500) {
    return {icon: badges.legend, key: "legend", };
  } else if (totalWorkouts >= 200) {
    return {icon: badges.champion, key: "champion", };
  } else if (totalWorkouts >= 100) {
    return {icon: badges.warrior, key: "warrior", };
  } else if (totalWorkouts >= 50) {
    return {icon: badges.riser, key: "riser", };
  } else if (totalWorkouts >= 10) {
    return {icon: badges.starter, key: "starter", };
  } else {
    return null;
  }
};

export default getAchievementBadge;