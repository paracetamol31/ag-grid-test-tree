import { ObjectDataItem } from "./ObjectDataItem";

export class Model {
    columnsName: Array<string> = ["Field0", "Field1", "Field2"];
    rootObjectDataItems: Array<ObjectDataItem> = [];

    getObjectItemByPath(path: Array<string>, parentObjectDataItem: ObjectDataItem | null = null): ObjectDataItem | null {
        if (path.length < 1) {
            return null
        }

        let resultObjectDataItem: ObjectDataItem | null = null;
        if (!parentObjectDataItem) {
            resultObjectDataItem = this.rootObjectDataItems.find((objectDataItem: ObjectDataItem) => objectDataItem.employeeId === path[0]) || null;
        } else {
            resultObjectDataItem = parentObjectDataItem.childItems.find(
                (objectDataItem: ObjectDataItem) => objectDataItem.employeeId === path[0]
            ) || null;
        }

        if (path.length === 1) {
            return resultObjectDataItem;
        }

        return this.getObjectItemByPath(path.slice(1), resultObjectDataItem);
    }
}