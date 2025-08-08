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

    const getStatusName = (id) => {
        switch (id) {
            case 1: return 'Pending';
            case 2: return 'Approved';
            case 3: return 'Rejected';
            default: return `Unknown (${id})`;
        }
    };
    
    const getDifferences = (beforeItems = [], afterItems = []) => {
    const diffs = [];

    const beforeMap = new Map(beforeItems.map(i => [i.item_id, i]));
    const afterMap = new Map(afterItems.map(i => [i.item_id, i]));
    const allItemIds = new Set([...beforeMap.keys(), ...afterMap.keys()]);

    for (const itemId of allItemIds) {
        const b = beforeMap.get(itemId);
        const a = afterMap.get(itemId);

        const vendorDiffs = [];

        // Use vendor_id (or pivot id) as stable key
        const bVendorMap = new Map(
            (b?.vendors || []).map(v => [v.vendor_id, v])
        );
        const aVendorMap = new Map(
            (a?.vendors || []).map(v => [v.vendor_id, v])
        );

        const allVendorIds = new Set([...bVendorMap.keys(), ...aVendorMap.keys()]);

        for (const vendorId of allVendorIds) {
            const bv = bVendorMap.get(vendorId);
            const av = aVendorMap.get(vendorId);

            const filterFields = (v) => {
                const keys = ['quote', 'stock', 'qty_order', 'remarks'];
                const filtered = {};
                keys.forEach(k => {
                    if (v[k] !== undefined) {
                        filtered[k] = (k === 'remarks' && !v[k]) ? 'N/A' : v[k];
                    }
                });
                return filtered;
            };

            if (bv && !av) {
                vendorDiffs.push({
                    type: 'before',
                    vendor_id: bv.vendor_id,
                    vendor_name: bv?.vendor?.name ?? 'Unknown Vendor',
                    fields: filterFields(bv)
                });
            } else if (!bv && av) {
                vendorDiffs.push({
                    type: 'after',
                    vendor_id: av.vendor_id,
                    vendor_name: av?.vendor?.name ?? 'Unknown Vendor',
                    fields: filterFields(av)
                });
            } else if (bv && av) {
                const changed = {};
                ['quote', 'stock', 'qty_order', 'remarks'].forEach(key => {
                    if (String(bv[key] ?? '') !== String(av[key] ?? '')) {
                        changed[key] = {
                            before: (key === 'remarks' && !bv[key]) ? 'N/A' : bv[key],
                            after: (key === 'remarks' && !av[key]) ? 'N/A' : av[key]
                        };
                    }
                });

                if (Object.keys(changed).length > 0) {
                    vendorDiffs.push({
                        type: 'before',
                        vendor_id: bv.vendor_id,
                        vendor_name: bv?.vendor?.name ?? 'Unknown Vendor',
                        fields: Object.fromEntries(Object.entries(changed).map(([k, v]) => [k, v.before]))
                    });
                    vendorDiffs.push({
                        type: 'after',
                        vendor_id: av.vendor_id,
                        vendor_name: av?.vendor?.name ?? 'Unknown Vendor',
                        fields: Object.fromEntries(Object.entries(changed).map(([k, v]) => [k, v.after]))
                    });
                }
            }
        }

        

        const qtyChanged = b?.qty_needed !== a?.qty_needed;

        if (qtyChanged || vendorDiffs.length > 0) {
            if (b && (qtyChanged || vendorDiffs.some(d => d.type === 'before'))) {
                diffs.push({
                    type: 'before',
                    item_id: itemId,
                    item_description: b?.item?.description ?? a?.item?.description ?? 'Unknown Item',
                    ...(qtyChanged ? { qty_needed: b?.qty_needed } : {}),
                    vendors: vendorDiffs.filter(d => d.type === 'before')
                });
            }

            if (a && (qtyChanged || vendorDiffs.some(d => d.type === 'after'))) {
                diffs.push({
                    type: 'after',
                    item_id: itemId,
                    item_description: a?.item?.description ?? b?.item?.description ?? 'Unknown Item',
                    ...(qtyChanged ? { qty_needed: a?.qty_needed } : {}),
                    vendors: vendorDiffs.filter(d => d.type === 'after')
                });
            }
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
                            {(log.before?.remarks || log.after?.remarks) && (
                                <div className={`${s.dataWrapper} ${s.remarks}`}>
                                    {log.before?.status_id !== log.after?.status_id && (
                                        <div className={s.fields}>
                                            <div className={s.statusHeader}><span>Status:</span> <div className={s.statusChanges}>{getStatusName(log.before?.status_id)} → {getStatusName(log.after?.status_id)}</div></div>
                                        </div>
                                    )}
                                    {log.before?.approved_by || log.after?.approved_by ? (
                                        <div className={s.fields}>
                                            <p><span>Approver:</span> {log.after?.approved_by ?? log.before?.approved_by}</p>
                                        </div>
                                    ) : null}
                                    {log.before?.remarks || log.after?.remarks ? (
                                        <div className={s.fields}>
                                            <p><span>Remarks:</span> {log.after?.remarks ?? log.before?.remarks}</p>
                                        </div>
                                    ) : null}
                                </div>
                            )}
                            {diffs.map((diff, i) => (
                                <div
                                    key={i}
                                    className={`${s.dataWrapper} ${s[diff.type]}`}
                                >
                                    <p className={s.description}><span>Item:</span> {diff.item_description}</p>
                                    {diff.qty_needed !== undefined && (
                                        <div className={s.fields}>
                                            <p><span>Needed Amount:</span> {diff.qty_needed}</p>
                                        </div>
                                    )}
                                    {diff.vendors.length > 0 && (
                                        <div className={s.vendorContainer}>
                                            {diff.vendors.map((vendor, j) => (
                                                <div key={j} className={s.vendorItem}>
                                                    <p className={s.vendorName}><span>Vendor:</span> {vendor.vendor_name}</p>
                                                    <div className={s.fields}>
                                                        {Object.entries(vendor.fields).map(([key, value]) => (
                                                            <p key={key}>
                                                                <span>{key}:</span> {key === 'remarks' && value === null ? 'N/A' : value}
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


{/* 
my changelog compares fields of before and after json files and only takes the fields that has changes. im currently facing an issue where it swaps the 2 vendors of the item which is aluminum tubes

here is a copy paste from the ui of my frontend to give you an idea:

before: (Item: Aluminum Tubes

Vendor: PureMint Traders

quote: 21.32

stock: 4832

qty_order: 432

Vendor: PackPro Industries

quote: 27.43

stock: 2345

qty_order: 0

remarks: N/A)

after: (Item: Aluminum Tubes

Vendor: PureMint Traders

quote: 27.43

stock: 2345

qty_order: 0

Vendor: CityLights Electrical

quote: 21.32

stock: 4832

qty_order: 432

remarks: N/A)

and this is my response from the backend for the previos snippet (focus on aluminum tubes)
{
	"0": {
		"id": 2,
		"ref_table": "canvass_sheets",
		"ref_id": 1,
		"created_by": "maker",
		"before": {
			"id": 1,
			"items": [
				{
					"id": 1,
					"item": {
						"id": 1,
						"description": "LED Bulb"
					},
					"item_id": 1,
					"vendors": [
						{
							"id": 1,
							"quote": "87.00",
							"stock": 324,
							"vendor": {
								"id": 2,
								"name": "CityLights Electrical"
							},
							"remarks": null,
							"qty_order": 34,
							"vendor_id": 2,
							"created_at": "2025-08-07T22:45:56.000000Z",
							"updated_at": "2025-08-07T22:52:19.000000Z",
							"canvass_item_id": 1
						}
					],
					"canvass_id": 1,
					"created_at": "2025-08-07T22:45:56.000000Z",
					"qty_needed": 34,
					"updated_at": "2025-08-07T22:52:19.000000Z"
				},
				{
					"id": 2,
					"item": {
						"id": 2,
						"description": "Aluminum Tubes"
					},
					"item_id": 2,
					"vendors": [
						{
							"id": 2,
							"quote": "27.43",
							"stock": 2345,
							"vendor": {
								"id": 3,
								"name": "PureMint Traders"
							},
							"remarks": null,
							"qty_order": 0,
							"vendor_id": 3,
							"created_at": "2025-08-07T22:45:56.000000Z",
							"updated_at": "2025-08-07T22:52:19.000000Z",
							"canvass_item_id": 2
						},
						{
							"id": 5,
							"quote": "21.32",
							"stock": 4832,
							"vendor": {
								"id": 2,
								"name": "CityLights Electrical"
							},
							"remarks": null,
							"qty_order": 432,
							"vendor_id": 2,
							"created_at": "2025-08-07T22:52:19.000000Z",
							"updated_at": "2025-08-07T22:52:19.000000Z",
							"canvass_item_id": 2
						}
					],
					"canvass_id": 1,
					"created_at": "2025-08-07T22:45:56.000000Z",
					"qty_needed": 432,
					"updated_at": "2025-08-07T22:45:56.000000Z"
				}
			],
			"remarks": null,
			"status_id": 1,
			"created_at": "2025-08-07T22:45:56.000000Z",
			"created_by": "maker",
			"updated_at": "2025-08-07T22:52:19.000000Z",
			"approved_by": null
		},
		"after": {
			"id": 1,
			"items": [
				{
					"id": 1,
					"item": {
						"id": 1,
						"description": "LED Bulb"
					},
					"item_id": 1,
					"vendors": [
						{
							"id": 1,
							"quote": "87.00",
							"stock": 324,
							"vendor": {
								"id": 2,
								"name": "CityLights Electrical"
							},
							"remarks": null,
							"qty_order": 30,
							"vendor_id": 2,
							"created_at": "2025-08-07T22:45:56.000000Z",
							"updated_at": "2025-08-07T22:53:25.000000Z",
							"canvass_item_id": 1
						}
					],
					"canvass_id": 1,
					"created_at": "2025-08-07T22:45:56.000000Z",
					"qty_needed": 30,
					"updated_at": "2025-08-07T22:53:25.000000Z"
				},
				{
					"id": 2,
					"item": {
						"id": 2,
						"description": "Aluminum Tubes"
					},
					"item_id": 2,
					"vendors": [
						{
							"id": 2,
							"quote": "21.32",
							"stock": 4832,
							"vendor": {
								"id": 3,
								"name": "PureMint Traders"
							},
							"remarks": null,
							"qty_order": 432,
							"vendor_id": 3,
							"created_at": "2025-08-07T22:45:56.000000Z",
							"updated_at": "2025-08-07T22:53:25.000000Z",
							"canvass_item_id": 2
						},
						{
							"id": 5,
							"quote": "27.43",
							"stock": 2345,
							"vendor": {
								"id": 2,
								"name": "CityLights Electrical"
							},
							"remarks": null,
							"qty_order": 0,
							"vendor_id": 2,
							"created_at": "2025-08-07T22:52:19.000000Z",
							"updated_at": "2025-08-07T22:53:25.000000Z",
							"canvass_item_id": 2
						}
					],
					"canvass_id": 1,
					"created_at": "2025-08-07T22:45:56.000000Z",
					"qty_needed": 432,
					"updated_at": "2025-08-07T22:45:56.000000Z"
				}
			],
			"remarks": null,
			"status_id": 1,
			"created_at": "2025-08-07T22:45:56.000000Z",
			"created_by": "maker",
			"updated_at": "2025-08-07T22:52:19.000000Z",
			"approved_by": null
		},
		"created_at": "2025-08-07T22:53:25.000000Z",
		"updated_at": "2025-08-07T22:53:25.000000Z"
	}
}
    */}