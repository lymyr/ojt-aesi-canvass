<?php

use App\Models\LogData;

if (!function_exists('log_change')) {
    function log_change(string $refTable, int $refId, string $createdBy, ?array $before = null, ?array $after = null
    ): void {
        LogData::create([
            'ref_table' => $refTable,
            'ref_id' => $refId,
            'created_by' => $createdBy,
            'before' => $before,
            'after' => $after,
        ]);
    }
}