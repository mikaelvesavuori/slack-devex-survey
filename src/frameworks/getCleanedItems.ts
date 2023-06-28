import { DynamoItem } from '../interfaces/DynamoDb';

/**
 * @description Clean up and return items in a normalized `CleanedItem` format.
 */
export function getCleanedItems(
  items: DynamoItem[],
  remappedKeys?: RemappedKeys
): Record<string, any>[] {
  if (items && items.length > 0)
    return items.map((item: DynamoItem) => createCleanedItem(item, remappedKeys));
  return [];
}

/**
 * @description Produce an object with a cleaned and restored format based on the input data.
 */
function createCleanedItem(item: DynamoItem, remappedKeys?: RemappedKeys): Record<string, any> {
  const cleanedItem: Record<string, any> = {};

  Object.entries(item).forEach((entry: any) => {
    const [key, value] = entry;
    if (!remappedKeys) cleanedItem[key] = Object.values(value)[0];
    else {
      const { pk, sk } = remappedKeys;
      if (key === 'pk') cleanedItem[pk as string] = Object.values(value)[0];
      else if (key === 'sk') cleanedItem[sk as string] = Object.values(value)[0];
      else cleanedItem[key] = Object.values(value)[0];
    }
  });

  return cleanedItem;
}

type RemappedKeys = {
  pk?: string;
  sk?: string;
};
