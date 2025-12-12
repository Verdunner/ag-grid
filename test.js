import { TreeStore } from './src/store/TreeStore.ts';
const items = [
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

// getItem
console.log(store.getItem(4)); // { id: 4, parent: '91064cee', label: 'Айтем 4' }

// getChildren
console.log(store.getChildren('91064cee'));
// [ { id:4 ...}, { id:5 ...}, { id:6 ...} ]

// getAllChildren
console.log(store.getAllChildren(1));
// Все потомки 1 рекурсивно

// getAllParents (порядок от элемента к корню)
console.log(store.getAllParents(7));
// [ {id:7...}, {id:4...}, {id:'91064cee'...}, {id:1...} ]

// addItem
store.addItem({ id: 9, parent: 1, label: 'Айтем 9' });
console.log(store.getChildren(1)); // содержит новый элемент

// updateItem
store.updateItem({ id: 9, label: 'Айтем 9 Обновленный' });
console.log(store.getItem(9)); // label обновлён

// removeItem
store.removeItem('91064cee');
console.log(store.getAll()); // удалены '91064cee' и все её потомки
