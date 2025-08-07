<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    protected $fillable = [
        'ref_id', 'ref_table', 'file_name', 'path', 'added_by'
    ];

}
