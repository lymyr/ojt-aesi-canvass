<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CanvassSheet extends Model
{
    protected $fillable = [
        'created_by',
        'approved_by',
        'remarks',
        'status_id'
    ];
    
    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function items()
    {
        return $this->hasMany(CanvassItem::class, 'canvass_id');
    }
    // public function vendors()
    // {
    //     return $this->hasMany(CanvassItemVendor::class, 'canvass_item_id');
    // }
}
