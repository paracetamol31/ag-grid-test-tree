export class ObjectDataItem {
    fields: Array<string> = [];
    parent: ObjectDataItem | null = null;
    childItems: Array<ObjectDataItem> = [];
    employeeId: string = Math.round(Math.random() * 100000000).toString();

    ifGroupe(): boolean {
        return this.childItems.length > 0;
    }

    getParent(): ObjectDataItem | null {
        return this.parent;
    }

    getAbsolutePathHierarchy(): Array<string> {
        const resultPath: Array<string> = [this.employeeId];

        if (this.parent) {
            resultPath.unshift(...this.getAbsolutePathHierarchy());
        }

        return resultPath;
    }

    convertObjectDataItem(columNames: Array<string>) {
        const resultObject: any = {};
        for (let i in this.fields) {
            resultObject[columNames[i]] = this.fields[i];
        }

        resultObject["employeeId"] = this.employeeId;
        return resultObject;
    }
}