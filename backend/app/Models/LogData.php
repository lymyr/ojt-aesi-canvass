<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogData extends Model
{
    protected $fillable = [
        'ref_table', 'ref_id', 'created_by', 'before', 'after',
    ];

    protected $casts = [
        'before' => 'array',
        'after' => 'array',
    ];
}
