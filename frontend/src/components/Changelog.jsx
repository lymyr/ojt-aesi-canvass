import { useEffect, useState } from 'react';
import axios from '../axios';
import s from './Changelog.module.css';

function Changelog({ refTable = 'canvass_sheets', id }) {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        axios.get(`/api/changelog/${refTable}/${id}`)
            .then(res => setLogs(res.data))
            .catch(err => console.error(err));
    }, [refTable, id]);

    const getDifferences = (beforeItems = [], afterItems = []) => {
        const diffs = [];

        const beforeMap = new Map(beforeItems.map(i => [i.item_id, i]));
        const afterMap = new Map(afterItems.map(i => [i.item_id, i]));

        const allItemIds = new Set([...beforeMap.keys(), ...afterMap.keys()]);

        for (const itemId of allItemIds) {
            const b = beforeMap.get(itemId);
            const a = afterMap.get(itemId);

            const vendorDiffs = [];

            const bVendors = b?.vendors || [];
            const aVendors = a?.vendors || [];

            const bVendorMap = new Map(bVendors.map(v => [v.vendor_id, v]));
            const aVendorMap = new Map(aVendors.map(v => [v.vendor_id, v]));

            const allVendorIds = new Set([...bVendorMap.keys(), ...aVendorMap.keys()]);

            for (const vid of allVendorIds) {
                const bv = bVendorMap.get(vid);
                const av = aVendorMap.get(vid);

                const filterFields = (v) => {
                    const keys = ['quote', 'stock', 'qty_order', 'remarks'];
                    const filtered = {};
                    keys.forEach(k => {
                        if (v[k] !== undefined) filtered[k] = v[k];
                    });
                    return filtered;
                };

                if (bv && !av) {
                    vendorDiffs.push({
                        type: 'before',
                        vendor_id: vid,
                        fields: filterFields(bv)
                    });
                } else if (!bv && av) {
                    vendorDiffs.push({
                        type: 'after',
                        vendor_id: vid,
                        fields: filterFields(av)
                    });
                } else if (bv && av) {
                    const changed = {};
                    ['quote', 'stock', 'qty_order', 'remarks'].forEach(key => {
                        if (String(bv[key] ?? '') !== String(av[key] ?? '')) {
                            changed[key] = {
                                before: bv[key],
                                after: av[key]
                            };
                        }
                    });

                    if (Object.keys(changed).length > 0) {
                        vendorDiffs.push({
                            type: 'before',
                            vendor_id: vid,
                            fields: Object.fromEntries(
                                Object.entries(changed).map(([k, v]) => [k, v.before])
                            )
                        });
                        vendorDiffs.push({
                            type: 'after',
                            vendor_id: vid,
                            fields: Object.fromEntries(
                                Object.entries(changed).map(([k, v]) => [k, v.after])
                            )
                        });
                    }
                }
            }

            if (
                (b?.qty_needed !== a?.qty_needed) ||
                vendorDiffs.length > 0
            ) {
                if (b && (b?.qty_needed !== a?.qty_needed || vendorDiffs.some(d => d.type === 'before')))
                    diffs.push({
                        type: 'before',
                        item_id: itemId,
                        ...(b?.qty_needed !== a?.qty_needed ? { qty_needed: b?.qty_needed } : {}),
                        vendors: vendorDiffs.filter(d => d.type === 'before')
                    });

                if (a && (b?.qty_needed !== a?.qty_needed || vendorDiffs.some(d => d.type === 'after')))
                    diffs.push({
                        type: 'after',
                        item_id: itemId,
                        ...(b?.qty_needed !== a?.qty_needed ? { qty_needed: a?.qty_needed } : {}),
                        vendors: vendorDiffs.filter(d => d.type === 'after')
                    });
            }
        }

        return diffs;
    };

    let hasChanges = false;

    return (
        <div className={s.logContainer}>
            {logs.map(log => {
                const diffs = getDifferences(log.before?.items, log.after?.items);

                if (diffs.length === 0) return null;

                hasChanges = true;

                return (
                    <div key={log.id} className={s.changelog}>
                        <div className={s.header}>
                            <h1>{new Date(log.created_at).toLocaleString()}</h1>
                            <h1>{log.created_by}</h1>
                        </div>
                        <div className={s.log}>
                            {diffs.map((diff, i) => (
                                <div
                                    key={i}
                                    className={`${s.dataWrapper} ${s[diff.type]}`}
                                >
                                    <p className={s.description}>Item #{diff.item_id}</p>
                                    {diff.qty_needed !== undefined && (
                                        <div className={s.fields}>
                                            <p>Needed Amount: {diff.qty_needed}</p>
                                        </div>
                                    )}
                                    {diff.vendors.length > 0 && (
                                        <div className={s.vendorContainer}>
                                            {diff.vendors.map((vendor, j) => (
                                                <div key={j} className={s.vendorItem}>
                                                    <p className={s.vendorName}>Vendor #{vendor.vendor_id}</p>
                                                    <div className={s.fields}>
                                                        {Object.entries(vendor.fields).map(([key, value]) => (
                                                            <p key={key}>
                                                                {key === 'remarks' && value === null
                                                                    ? `${key}: N/A`
                                                                    : `${key}: ${value}`}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            {!hasChanges && (
                <p className={s.noChanges}>Canvass hasn’t been updated.</p>
            )}
        </div>
    );
}

export default Changelog;