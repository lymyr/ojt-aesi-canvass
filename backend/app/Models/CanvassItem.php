<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CanvassItem extends Model
{
    protected $fillable = [
        'canvass_id',
        'item_id',
        'qty_needed'
    ];
    
    public function vendors()
    {
        return $this->hasMany(CanvassItemVendor::class);
    }
}
