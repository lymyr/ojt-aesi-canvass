<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CanvassItemVendor extends Model
{
    protected $fillable = [
        'canvass_item_id',
        'quote_id',
        'stock',
        'qty_order',
        'remarks'
    ];
    
    public function quote()
    {
        return $this->belongsTo(VendorQuote::class, 'quote_id');
    }
}
