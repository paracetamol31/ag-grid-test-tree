import { FC } from "react";

export const SimpleCellRenderer: FC = (params: any) => {
    const cellData = params.getValue();
    return (
        <>{cellData}</>
    );
}