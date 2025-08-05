<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    protected $fillable = [
        'ref_id', 
        'file_name', 
        'path', 
        'added_by',
    ];
    // shouldnt be limited to canvass sheet
    public function canvassSheet()
    {
        return $this->belongsTo(CanvassSheet::class, 'ref_id');
    }

}
