<template>
    <AgGridVue
        class="ag-theme-alpine"
        style="width: 100%; height: 600px"
        :rowData="rowData"
        :columnDefs="columnDefs"
        :treeData="true"
        :getDataPath="getDataPath"
        :autoGroupColumnDef="autoGroupColumnDef"
        @grid-ready="onGridReady"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import type {
    ColDef,
    ICellRendererParams,
    GridReadyEvent,
} from 'ag-grid-community';
import type { ValueGetterParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { TreeStore, type TreeNode } from '../store/TreeStore';

interface RowNodeData extends TreeNode {
    path: string[];
    isLeaf: boolean;
    rowNumber: number;
}

// Инициализация данных
const items: TreeNode[] = [
    { id: 1, parent: null, label: 'Айтем 1' },
    { id: '91064cee', parent: 1, label: 'Айтем 2' },
    { id: 3, parent: 1, label: 'Айтем 3' },
    { id: 4, parent: '91064cee', label: 'Айтем 4' },
    { id: 5, parent: '91064cee', label: 'Айтем 5' },
    { id: 6, parent: '91064cee', label: 'Айтем 6' },
    { id: 7, parent: 4, label: 'Айтем 7' },
    { id: 8, parent: 4, label: 'Айтем 8' },
];

const store = new TreeStore(items);

// Преобразуем данные для treeData (каждый элемент содержит путь от корня)
const buildPath = (node: TreeNode): string[] => {
    const parents = store.getAllParents(node.id).reverse();
    return parents.map((p) => p.label);
};

const rowData = ref<RowNodeData[]>(
    items.map((n, idx) => ({
        ...n,
        path: buildPath(n),
        isLeaf: store.getChildren(n.id).length === 0,
        rowNumber: 0,
    }))
);

// Настройка столбцов
const columnDefs = ref<ColDef<RowNodeData>[]>([
    {
        headerName: '№ п/п',
        width: 80,
        valueGetter: (params: ValueGetterParams<RowNodeData>) =>
            params.data?.rowNumber ?? 0,
        pinned: 'left' as const,
        resizable: false,
    },
    {
        field: 'label',
        headerName: 'Наименование',
        resizable: false,
        flex: 1,
    },
]);

// autoGroupColumnDef для treeData
const autoGroupColumnDef: ColDef<RowNodeData> = {
    headerName: 'Категория',
    cellRendererParams: {
        suppressCount: true,
        innerRenderer: (params: ICellRendererParams<RowNodeData>) =>
            params.data?.isLeaf ? 'Элемент' : 'Группа',
    },
    width: 400,
    resizable: false,
};

// getDataPath возвращает путь до корня
const getDataPath = (data: RowNodeData): string[] => data.path;

// Разворачиваем все узлы при рендере
const onGridReady = (params: GridReadyEvent<RowNodeData>) => {
    params.api.forEachNode((node) => node.setExpanded(true));

    let counter = 1;
    params.api.forEachNodeAfterFilterAndSort((node) => {
        if (node.data) {
            node.data.rowNumber = counter++;
        }
    });

    params.api.refreshCells({ columns: ['№ п/п'], force: true });
};
</script>
