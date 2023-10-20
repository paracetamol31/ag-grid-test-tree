import { AgGridReact } from 'ag-grid-react';
import "ag-grid-enterprise";
import React, { FC, useCallback, useMemo, useRef } from 'react';
import { ColDef, ColGroupDef } from 'ag-grid-enterprise';
import { GridReadyEvent, IServerSideDatasource, IServerSideGetRowsParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Model } from '../../model/Model';
import { ObjectDataItem } from '../../model/ObjectDataItem';
import { SimpleCellRenderer } from '../cellRenderers/SimpleCellRenderer';
import { GroupeCelRenderer } from '../cellRenderers/GroupeCelRenderer';

const CellRendererSelector = () => {
    return { component: SimpleCellRenderer }
};

export const Grid: FC<{ model: Model }> = ({ model }) => {
    const gridRef = useRef<AgGridReact>(null);
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

    const columnDefs: Array<ColDef> = useMemo(
        (): Array<ColDef> => {
            let result: Array<ColDef | ColGroupDef> = [];
            for (const columnName of model.columnsName.slice(1)) {
                result.push({
                    headerName: columnName,
                    field: columnName,
                    width: 300,
                    colId: columnName,
                    cellRendererSelector: CellRendererSelector
                });
            }

            return result;
        },
        [model.columnsName]
    )

    const onGridReady = useCallback((event: GridReadyEvent) => {
        const dataSource: IServerSideDatasource = {
            getRows: (params: IServerSideGetRowsParams) => {
                const currentObjectDataItem: ObjectDataItem | null = model.getObjectItemByPath(params.request.groupKeys);

                const listObjectDataItem: Array<ObjectDataItem> = currentObjectDataItem ? currentObjectDataItem.childItems : model.rootObjectDataItems

                const endRow = params.request.endRow !== undefined && params.request.endRow <= listObjectDataItem.length
                    ? params.request.endRow
                    : listObjectDataItem.length;
                const rowData: Array<any> = [];

                const startRow = (params.request.startRow || 0);
                for (const objectDataItem of listObjectDataItem.slice(startRow, endRow)) {
                    const convertItem: any = objectDataItem.convertObjectDataItem(model.columnsName);
                    if (objectDataItem.childItems.length) {
                        convertItem.group = true;
                    }
                    rowData.push(convertItem)
                }

                const result = {
                    rowData: rowData,
                    rowCount: listObjectDataItem.length
                }

                //Имитация загрузки с сервера
                setTimeout(function () {
                    params.success(result);
                }, 200);
            },
        };

        event.api.setServerSideDatasource(dataSource);
    }, [model]);

    const autoGroupColumnDef = useMemo(() => {
        return {
            field: model.columnsName[0],
            headerName: model.columnsName[0],
            width: 300,
            cellRendererParams: {
                innerRenderer: GroupeCelRenderer
            },
        };
    }, [model.columnsName]);

    const isServerSideGroupOpenByDefault = useCallback((params: any) => {
        return false
    }, []);

    const isServerSideGroup = useCallback((dataItem: any) => {
        return dataItem.group;
    }, []);

    const getServerSideGroupKey = useCallback((dataItem: any) => {
        return dataItem.employeeId;
    }, []);

    return (
        <div style={containerStyle}>
            <div style={gridStyle} className="ag-theme-alpine">
                <AgGridReact
                    ref={gridRef}
                    columnDefs={columnDefs}
                    rowBuffer={0}
                    treeData={true}
                    autoGroupColumnDef={autoGroupColumnDef}
                    rowSelection={'multiple'}
                    components={{
                        renderColumn: { component: SimpleCellRenderer }
                    }}
                    rowModelType="serverSide"
                    cacheBlockSize={50}
                    cacheOverflowSize={2}
                    isServerSideGroupOpenByDefault={isServerSideGroupOpenByDefault}
                    maxConcurrentDatasourceRequests={1}
                    isServerSideGroup={isServerSideGroup}
                    getServerSideGroupKey={getServerSideGroupKey}
                    maxBlocksInCache={10}
                    onGridReady={onGridReady}
                    getDataPath={(data: any) =>
                        data.nesting
                    }
                />
            </div>
        </div>
    );
}