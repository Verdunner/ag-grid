import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DataTable from './DataTable.vue';

describe('DataTable.vue', () => {
    it('рендерится без ошибок', () => {
        const wrapper = mount(DataTable);
        expect(wrapper.exists()).toBe(true);
    });

    it('содержит таблицу AG Grid', () => {
        const wrapper = mount(DataTable);
        const gridEl = wrapper.find('.ag-theme-alpine');
        expect(gridEl.exists()).toBe(true);
    });
});
