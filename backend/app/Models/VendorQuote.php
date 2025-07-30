<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VendorQuote extends Model
{
    protected $fillable = ['vendor_id', 'item_id', 'quote'];
}
