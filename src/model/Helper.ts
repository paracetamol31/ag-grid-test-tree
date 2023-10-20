import { Model } from "./Model";
import { ObjectDataItem } from "./ObjectDataItem";

const generateTestObjectDataItem = (parent: ObjectDataItem, countItem: number, columnsName: Array<string>) => {
    for (let i = 0; i < countItem; i++) {
        const newObjectDataItem = new ObjectDataItem();
        for (let j = 0; j < columnsName.length; j++) {
            newObjectDataItem.fields[j] = `colum: ${columnsName[j]}; item_${i}`
        }
        parent.childItems.push(newObjectDataItem);
        newObjectDataItem.parent = parent;
    }
}

export const generateTestData = (model: Model) => {
    const rootObjectDataItem = new ObjectDataItem();
    rootObjectDataItem.fields[0] = "Корень";


    generateTestObjectDataItem(rootObjectDataItem, 200, model.columnsName);
    generateTestObjectDataItem(rootObjectDataItem.childItems[3], 10, model.columnsName);
    generateTestObjectDataItem(rootObjectDataItem.childItems[7], 10, model.columnsName);
    generateTestObjectDataItem(rootObjectDataItem.childItems[190], 100, model.columnsName);
    generateTestObjectDataItem(rootObjectDataItem.childItems[190].childItems[50], 100, model.columnsName);

    model.rootObjectDataItems.push(rootObjectDataItem);
}