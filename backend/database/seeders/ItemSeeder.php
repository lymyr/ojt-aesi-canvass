<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $uomIds = DB::table('uoms')->pluck('id', 'abbreviation');

        $items = [
            ['description' => 'Peppermint Oil', 'unit' => 'L', 'remarks' => 'Essential oil for cooling effect'],
            ['description' => 'Menthol Crystals', 'unit' => 'kg', 'remarks' => 'Cooling agent raw material'],
            ['description' => 'Eucalyptus Oil', 'unit' => 'L', 'remarks' => 'Fragrance & medicinal use'],
            ['description' => 'Camphor Powder', 'unit' => 'kg', 'remarks' => 'Topical analgesic ingredient'],
            ['description' => 'Aluminum Tubes', 'unit' => 'tube', 'remarks' => 'Packaging for ointments'],
            ['description' => 'Plastic Jars 50g', 'unit' => 'pc', 'remarks' => 'Packaging for balm'],
            ['description' => 'Plastic Jars 100g', 'unit' => 'pc', 'remarks' => 'Packaging for balm'],
            ['description' => 'Bottle Caps 28mm', 'unit' => 'pc', 'remarks' => 'For plastic bottles'],
            ['description' => 'Shrink Wrap Film', 'unit' => 'roll', 'remarks' => 'Packaging sealing material'],
            ['description' => 'Printed Labels Small', 'unit' => 'sht', 'remarks' => 'For 50g jars'],
            ['description' => 'Printed Labels Large', 'unit' => 'sht', 'remarks' => 'For 100g jars'],
            ['description' => 'Menthol Solution', 'unit' => 'L', 'remarks' => 'Diluted menthol in alcohol'],
            ['description' => 'Herbal Extract Blend', 'unit' => 'L', 'remarks' => 'Mixed plant extracts'],
            ['description' => 'Plastic Bottles 30ml', 'unit' => 'pc', 'remarks' => 'For liquid liniment'],
            ['description' => 'Plastic Bottles 60ml', 'unit' => 'pc', 'remarks' => 'For liquid liniment'],
            ['description' => 'Plastic Bottles 120ml', 'unit' => 'pc', 'remarks' => 'For liquid liniment'],
            ['description' => 'Cardboard Cartons Small', 'unit' => 'ctn', 'remarks' => 'Holds 50g jars'],
            ['description' => 'Cardboard Cartons Large', 'unit' => 'ctn', 'remarks' => 'Holds 100g jars'],
            ['description' => 'Mixing Agent X-100', 'unit' => 'kg', 'remarks' => 'For emulsifying ingredients'],
            ['description' => 'Fragrance Oil Mint', 'unit' => 'L', 'remarks' => 'Mint scent blend'],
            ['description' => 'Fragrance Oil Herbal', 'unit' => 'L', 'remarks' => 'Herbal scent blend'],
            ['description' => 'Cooling Agent WS-23', 'unit' => 'kg', 'remarks' => 'Synthetic cooling enhancer'],
            ['description' => 'Glass Droppers 30ml', 'unit' => 'pc', 'remarks' => 'For essential oils'],
            ['description' => 'Glass Droppers 60ml', 'unit' => 'pc', 'remarks' => 'For essential oils'],
            ['description' => 'Measuring Spoons', 'unit' => 'set', 'remarks' => 'Lab equipment'],
            ['description' => 'Lab Beakers 500ml', 'unit' => 'pc', 'remarks' => 'Mixing chemicals'],
            ['description' => 'Pallet Wood', 'unit' => 'plt', 'remarks' => 'For transporting goods'],
            ['description' => 'Stretch Film', 'unit' => 'roll', 'remarks' => 'Wrapping pallets'],
            ['description' => 'Rubber Stoppers', 'unit' => 'pc', 'remarks' => 'For sealing bottles'],
            ['description' => 'Herbal Powder Mix', 'unit' => 'kg', 'remarks' => 'Raw material blend'],
        ];

        // Convert unit abbreviation to unit_id before insert
        $data = [];
        foreach ($items as $item) {
            if (!isset($uomIds[$item['unit']])) {
                continue; // Skip if UOM doesn't exist
            }

            $data[] = [
                'description' => $item['description'],
                'unit_id' => $uomIds[$item['unit']],
                'remarks' => $item['remarks'],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('items')->insert($data);
    }
}
