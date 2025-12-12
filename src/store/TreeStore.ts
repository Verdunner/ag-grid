export interface TreeNode {
    id: number | string;
    parent: number | string | null;
    label: string;
}

export class TreeStore {
    private nodes: TreeNode[];
    private map: Map<number | string, TreeNode>;
    private indexMap: Map<number | string, number>;
    private childrenMap: Map<number | string | null, TreeNode[]>;

    constructor(nodes: TreeNode[] = []) {
        this.nodes = nodes;
        this.map = new Map();
        this.indexMap = new Map();

        this.childrenMap = new Map();

        nodes.forEach((n, i) => {
            this.map.set(n.id, n);

            this.indexMap.set(n.id, i);

            if (!this.childrenMap.has(n.parent))
                this.childrenMap.set(n.parent, []);

            this.childrenMap.get(n.parent)!.push(n);
        });
    }

    /** Возвращает изначальный массив элементов */
    getAll(): TreeNode[] {
        return this.nodes;
    }

    /** Возвращает элемент по id */
    getItem(id: number | string): TreeNode | undefined {
        return this.map.get(id);
    }

    /** Возвращает массив прямых дочерних элементов */
    getChildren(id: number | string | null): TreeNode[] {
        return this.childrenMap.get(id) || [];
    }

    /** Возвращает все дочерние элементы рекурсивно */
    getAllChildren(id: number | string): TreeNode[] {
        const result: TreeNode[] = [];
        const stack = [...this.getChildren(id)];

        while (stack.length) {
            const node = stack.pop()!;
            result.push(node);
            stack.push(...this.getChildren(node.id));
        }

        return result;
    }

    /** Возвращает путь от элемента к корню */
    getAllParents(id: number | string): TreeNode[] {
        const result: TreeNode[] = [];
        let node = this.getItem(id);

        while (node) {
            result.push(node);
            if (node.parent === null) break;
            node = this.getItem(node.parent);
        }

        return result;
    }

    /** Добавляет новый элемент */
    addItem(item: TreeNode): void {
        this.nodes.push(item);
        const idx = this.nodes.length - 1;
        this.map.set(item.id, item);
        this.indexMap.set(item.id, idx);

        if (!this.childrenMap.has(item.parent))
            this.childrenMap.set(item.parent, []);
        this.childrenMap.get(item.parent)!.push(item);
    }

    /** Удаляет элемент и всех его потомков */
    removeItem(id: number | string): void {
        const toRemoveSet = new Set([
            id,
            ...this.getAllChildren(id).map((n) => n.id),
        ]);

        // удаляем из nodes и пересоздаём indexMap
        this.nodes = this.nodes.filter((n) => !toRemoveSet.has(n.id));
        this.indexMap.clear();
        this.nodes.forEach((n, i) => this.indexMap.set(n.id, i));

        // удаляем из map
        toRemoveSet.forEach((key) => this.map.delete(key));

        // обновляем childrenMap
        for (const key of toRemoveSet) {
            this.childrenMap.delete(key);
        }
        // удаляем элементы из массивов потомков
        this.childrenMap.forEach((arr, parentId) => {
            this.childrenMap.set(
                parentId,
                arr.filter((n) => !toRemoveSet.has(n.id))
            );
        });
    }

    /** Обновляет существующий элемент */
    updateItem(item: TreeNode) {
        const idx = this.indexMap.get(item.id);
        if (idx === undefined) return;

        const oldItem = this.nodes[idx];
        if (!oldItem) return;
        this.nodes[idx] = { ...oldItem, ...item };
        this.map.set(item.id, this.nodes[idx]);

        if (oldItem.parent !== item.parent) {
            // удалить из старого родителя
            const oldParentArr = this.childrenMap.get(oldItem.parent);
            if (oldParentArr) {
                this.childrenMap.set(
                    oldItem.parent,
                    oldParentArr.filter((n) => n.id !== item.id)
                );
            }
            // добавить в нового родителя
            if (!this.childrenMap.has(item.parent))
                this.childrenMap.set(item.parent, []);
            this.childrenMap.get(item.parent)!.push(this.nodes[idx]);
        }
    }
}
