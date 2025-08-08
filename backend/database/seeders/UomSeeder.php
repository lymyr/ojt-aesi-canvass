<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $uoms = [
            // General count
            ['unit' => 'Piece', 'abbreviation' => 'pc'],
            ['unit' => 'Dozen', 'abbreviation' => 'doz'],
            ['unit' => 'Pair', 'abbreviation' => 'pr'],
            ['unit' => 'Set', 'abbreviation' => 'set'],
            ['unit' => 'Pack', 'abbreviation' => 'pk'],
            ['unit' => 'Bundle', 'abbreviation' => 'bdl'],
            ['unit' => 'Carton', 'abbreviation' => 'ctn'],
            ['unit' => 'Box', 'abbreviation' => 'box'],
            ['unit' => 'Bag', 'abbreviation' => 'bag'],
            ['unit' => 'Bottle', 'abbreviation' => 'btl'],
            ['unit' => 'Can', 'abbreviation' => 'can'],
            ['unit' => 'Roll', 'abbreviation' => 'roll'],
            ['unit' => 'Sheet', 'abbreviation' => 'sht'],
            ['unit' => 'Strip', 'abbreviation' => 'str'],
            ['unit' => 'Sack', 'abbreviation' => 'sack'],
            ['unit' => 'Ream', 'abbreviation' => 'ream'],

            // Weight
            ['unit' => 'Milligram', 'abbreviation' => 'mg'],
            ['unit' => 'Gram', 'abbreviation' => 'g'],
            ['unit' => 'Kilogram', 'abbreviation' => 'kg'],
            ['unit' => 'Metric Ton', 'abbreviation' => 'MT'],
            ['unit' => 'Pound', 'abbreviation' => 'lb'],
            ['unit' => 'Ounce', 'abbreviation' => 'oz'],

            // Volume (liquids)
            ['unit' => 'Milliliter', 'abbreviation' => 'mL'],
            ['unit' => 'Liter', 'abbreviation' => 'L'],
            ['unit' => 'Cubic Centimeter', 'abbreviation' => 'cm³'],
            ['unit' => 'Cubic Meter', 'abbreviation' => 'm³'],
            ['unit' => 'Gallon', 'abbreviation' => 'gal'],
            ['unit' => 'Quart', 'abbreviation' => 'qt'],
            ['unit' => 'Pint', 'abbreviation' => 'pt'],

            // Length
            ['unit' => 'Millimeter', 'abbreviation' => 'mm'],
            ['unit' => 'Centimeter', 'abbreviation' => 'cm'],
            ['unit' => 'Meter', 'abbreviation' => 'm'],
            ['unit' => 'Kilometer', 'abbreviation' => 'km'],
            ['unit' => 'Inch', 'abbreviation' => 'in'],
            ['unit' => 'Foot', 'abbreviation' => 'ft'],
            ['unit' => 'Yard', 'abbreviation' => 'yd'],

            // Area
            ['unit' => 'Square Millimeter', 'abbreviation' => 'mm²'],
            ['unit' => 'Square Centimeter', 'abbreviation' => 'cm²'],
            ['unit' => 'Square Meter', 'abbreviation' => 'm²'],
            ['unit' => 'Square Foot', 'abbreviation' => 'ft²'],

            // Additional packaging / industrial
            ['unit' => 'Pallet', 'abbreviation' => 'plt'],
            ['unit' => 'Drum', 'abbreviation' => 'drum'],
            ['unit' => 'Barrel', 'abbreviation' => 'bbl'],
            ['unit' => 'Tube', 'abbreviation' => 'tube'],
            ['unit' => 'Tray', 'abbreviation' => 'tray'],
            ['unit' => 'Envelope', 'abbreviation' => 'env'],
            ['unit' => 'Coil', 'abbreviation' => 'coil'],
            ['unit' => 'Case', 'abbreviation' => 'cs'],
            ['unit' => 'Stick', 'abbreviation' => 'stk'],
        ];

        DB::table('uoms')->insert($uoms);
    }
}
