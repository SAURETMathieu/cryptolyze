export interface Region {
  name: string;
  shortCode: string;
}

export const filterRegions = (
  regions: Region[],
  priorityRegions: string[],
  whitelist: string[],
  blacklist: string[]
) => {
  let regionsListedFirst: any[] = [];
  let filteredRegions = regions;

  if (whitelist.length > 0) {
    filteredRegions = regions.filter(
      ({ shortCode }) => whitelist.indexOf(shortCode) > -1
    );
  } else if (blacklist.length > 0) {
    filteredRegions = regions.filter(
      ({ shortCode }) => blacklist.indexOf(shortCode) === -1
    );
  }

  if (priorityRegions.length > 0) {
    // ensure the Regions are added in the order in which they are specified by the user
    priorityRegions.forEach((slug) => {
      const result = filteredRegions.find(
        ({ shortCode }) => shortCode === slug
      );
      if (result) {
        regionsListedFirst.push(result);
      }
    });

    filteredRegions = filteredRegions.filter(
      ({ shortCode }) => priorityRegions.indexOf(shortCode) === -1
    );
  }

  return regionsListedFirst.length
    ? [...regionsListedFirst, ...filteredRegions]
    : filteredRegions;
};
