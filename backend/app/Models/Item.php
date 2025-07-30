<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = ['description', 'unit_id', 'unit', 'remarks'];

    public function uom()
    {
        return $this->belongsTo(Uom::class, 'unit_id');
    }
}
