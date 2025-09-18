import { Asset } from "expo-asset";
import { iconArray } from "../constants/icons";

const loadIcons = async () => {
  try {
    const cacheImages = iconArray.map(img =>
      Asset.fromModule(img).downloadAsync()
    );
    await Promise.all(cacheImages);
  } catch (e) {
    console.warn("Error caching icons", e);
  }
};

export default loadIcons;