import { ColDef } from "ag-grid-community";
import { FC } from "react";

export const GroupeCelRenderer: FC = (props: any) => {
    const data: any = props.data;
    const colDef: ColDef = props.colDef;
    const field: string = colDef.field || "";

    return field ? <>{data[field]}</> : <>...</>
}