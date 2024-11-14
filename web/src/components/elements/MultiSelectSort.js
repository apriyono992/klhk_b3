import React, { useState } from 'react';
import Select, { components } from 'react-select';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import useSWR from 'swr';
import { getFetcher, getSelectFetcher } from '../../services/api';
import axios from 'axios';

// Helper function to move array elements
function arrayMove(array, from, to) {
    const slicedArray = array.slice();
    slicedArray.splice(
        to < 0 ? array.length + to : to,
        0,
        slicedArray.splice(from, 1)[0]
    );
    return slicedArray;
}

// Sortable element for multi-value options
const SortableMultiValue = SortableElement((props) => {
    const onMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const innerProps = { ...props.innerProps, onMouseDown };
    return <components.MultiValue {...props} innerProps={innerProps} />;
});

// Sortable handle for the multi-value label
const SortableMultiValueLabel = SortableHandle((props) => (
    <components.MultiValueLabel {...props} />
));

// Sortable container for react-select
const SortableSelect = SortableContainer(Select);

const SortableItem = SortableElement(({ value, label, removeItem }) => (
    <div className="text-slate-800 flex w-full items-center rounded-md p-2 pl-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100">
        {label}
        <div className="ml-auto grid place-items-center justify-self-end">
            <button onClick={() => removeItem(value)} className="rounded-md border border-transparent p-1 text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
    </div>
));

// Sortable Container to wrap selected options
const SortableList = SortableContainer(({ items, removeItem }) => {
    return (
        <div className={`relative flex flex-col rounded-lg bg-white ${items.length === 0 ? '' : 'shadow-sm border border-slate-200'} mt-3`}>
            <nav className="flex flex-col gap-1 p-1.5 text-xs">
                {items.map((item, index) => (
                    <SortableItem
                        key={`item-${item.value}`}
                        index={index}
                        value={item.value}
                        label={item.label}
                        removeItem={removeItem}
                    />
                ))}
            </nav>
        </div>
    );
});

export default function MultiSelectSort({ value, onChange }) {
    const [selected, setSelected] = useState(value || []);

    const fetcher = (...args) => getSelectFetcher(...args);

    const { data, error, isLoading } = useSWR('/api/data-master/tembusan?limit=100', fetcher);

    const handleChange = (selectedOptions) => {
        setSelected(selectedOptions || [])
        onChange(selectedOptions)
    };

    const onSortEnd = ({ oldIndex, newIndex }) => {
        const newValue = arrayMove(selected, oldIndex, newIndex);
        setSelected(newValue);
        onChange(newValue)
    };

    const onSortEndList = ({ oldIndex, newIndex }) => {
        const newSelectedOptions = arrayMove(selected, oldIndex, newIndex);
        setSelected(newSelectedOptions);
        onChange(newSelectedOptions)
    };

    const removeItemList = (value) => {
        const newSelectedOptions = selected.filter((option) => option.value !== value);
        setSelected(newSelectedOptions);
        onChange(newSelectedOptions)
    };

    return (
        <div>
            <SortableSelect
                useDragHandle
                axis="xy"
                placeholder="Cari Tembusan"
                onSortEnd={onSortEnd}
                distance={4}
                getHelperDimensions={({ node }) => node.getBoundingClientRect()}
                isMulti
                isLoading={isLoading}
                options={data || []}
                value={selected}
                onChange={handleChange}
                noOptionsMessage={() => error ? 'Gagal memuat data' : 'Tidak ada data'}
                components={{
                    MultiValue: SortableMultiValue,
                    MultiValueLabel: SortableMultiValueLabel,
                }}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 10,
                    borderWidth: 4,
                    colors: {
                        ...theme.colors,
                        primary25: '#f4f4f5',
                    },
                })}
                styles={{
                    control: (styles) => ({ ...styles, backgroundColor: '#f4f4f5' }),
                    option: (styles) => ({ ...styles, color: '#475569', fontSize: '10pt' }),
                    placeholder: (styles) => ({ ...styles, color: '#475569', fontSize: '10pt' }),
                    multiValue: (styles) => ({ ...styles, backgroundColor: '#d1d5db', borderRadius: 5 }),
                    indicatorSeparator: (styles) => ({ ...styles, alignSelf: 'stretch', marginBottom: 8, marginTop: 8, width: 2, backgroundColor: '#e5e7eb' }),
                }}
                closeMenuOnSelect={false}
            />
            <SortableList items={selected} onSortEnd={onSortEndList} removeItem={removeItemList} axis="y" />
        </div>
    );
}
