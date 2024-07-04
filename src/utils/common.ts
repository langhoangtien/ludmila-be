export function getUniqueByProperty<T>(data: T[], property: string): T[] {
  const uniqueProperty = {};
  const uniqueData = data.filter((item) => {
    if (!uniqueProperty[item[property]]) {
      uniqueProperty[item[property]] = true;
      return true;
    }
    return false;
  });
  return uniqueData;
}
