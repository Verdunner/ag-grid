import { describe, it, expect, beforeEach } from 'vitest';
import { TreeStore, type TreeNode } from './TreeStore';

const items: TreeNode[] = [
    { id: 1, parent: null, label: 'A' },
    { id: 2, parent: 1, label: 'B' },
    { id: 3, parent: 1, label: 'C' },
    { id: 4, parent: 2, label: 'D' },
];

let store: TreeStore;

beforeEach(() => {
    store = new TreeStore(items);
});

describe('TreeStore', () => {
    it('getAll возвращает все элементы', () => {
        expect(store.getAll()).toHaveLength(4);
    });

    it('getItem возвращает элемент по id', () => {
        expect(store.getItem(2)?.label).toBe('B');
        expect(store.getItem(999)).toBeUndefined();
    });

    it('getChildren возвращает прямых потомков', () => {
        expect(store.getChildren(1).map((n) => n.id)).toEqual([2, 3]);
    });

    it('getAllChildren возвращает всех потомков рекурсивно', () => {
        const allChildren = store
            .getAllChildren(1)
            .map((n) => n.id)
            .sort();
        expect(allChildren).toEqual([2, 3, 4].sort());
    });

    it('getAllParents возвращает путь к корню', () => {
        const parents = store.getAllParents(4).map((n) => n.id);
        expect(parents).toEqual([4, 2, 1]);
    });

    it('addItem корректно добавляет элемент', () => {
        store.addItem({ id: 5, parent: 3, label: 'E' });
        expect(store.getItem(5)?.label).toBe('E');
        expect(store.getChildren(3).map((n) => n.id)).toContain(5);
    });

    it('removeItem удаляет элемент и всех потомков', () => {
        store.removeItem(2);
        expect(store.getItem(2)).toBeUndefined();
        expect(store.getItem(4)).toBeUndefined();
        expect(store.getChildren(1).map((n) => n.id)).toEqual([3]);
    });

    it('updateItem обновляет элемент', () => {
        store.updateItem({ id: 3, parent: null, label: 'C-updated' });
        const item = store.getItem(3);
        expect(item?.label).toBe('C-updated');
        expect(item?.parent).toBeNull();
    });
});
