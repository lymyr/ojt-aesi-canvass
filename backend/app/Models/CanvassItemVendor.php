<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CanvassItemVendor extends Model
{
    protected $table = 'canvass_item_vendor';

    protected $fillable = [
        'canvass_item_id',
        'vendor_id',
        'quote',
        'stock',
        'qty_order',
        'remarks'
    ];
    
    public function canvassItem()
    {
        return $this->belongsTo(CanvassItem::class);
    }
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }
}
