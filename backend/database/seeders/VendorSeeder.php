<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VendorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vendors = [
            ['name' => 'PureMint Traders', 'address' => 'Blk 12 Lot 5, Valenzuela City', 'tin' => '123-456-789-000', 'remarks' => 'Peppermint oil supplier'],
            ['name' => 'PackPro Industries', 'address' => 'Binondo, Manila', 'tin' => '234-567-890-000', 'remarks' => 'Plastic jars & bottles'],
            ['name' => 'Global Essential Oils', 'address' => 'Taguig City', 'tin' => '345-678-901-000', 'remarks' => 'Eucalyptus & essential oils'],
            ['name' => 'Herbal Extracts Corp.', 'address' => 'Caloocan City', 'tin' => '456-789-012-000', 'remarks' => 'Herbal raw materials'],
            ['name' => 'MetroCap Closures', 'address' => 'Quezon City', 'tin' => '567-890-123-000', 'remarks' => 'Bottle caps & closures'],
            ['name' => 'FreshScents Packaging', 'address' => 'Malabon City', 'tin' => '678-901-234-000', 'remarks' => 'Labels & printed packaging'],
            ['name' => 'MintyCool Chemicals', 'address' => 'Makati City', 'tin' => '789-012-345-000', 'remarks' => 'Menthol crystals supplier'],
            ['name' => 'AromaBlend Solutions', 'address' => 'Pasig City', 'tin' => '890-123-456-000', 'remarks' => 'Fragrance & scent blends'],
            ['name' => 'PolyFlex Plastics', 'address' => 'Cavite', 'tin' => '901-234-567-000', 'remarks' => 'Plastic containers'],
            ['name' => 'GreenLeaf Trading', 'address' => 'Laguna', 'tin' => '912-345-678-000', 'remarks' => 'Organic herbal leaves'],
            ['name' => 'HerbWorks Manufacturing', 'address' => 'Bulacan', 'tin' => '923-456-789-000', 'remarks' => 'Herbal oil extracts'],
            ['name' => 'SealRight Industries', 'address' => 'Batangas', 'tin' => '934-567-890-000', 'remarks' => 'Sealing & capping machines'],
            ['name' => 'VitaMix Chemicals', 'address' => 'Parañaque City', 'tin' => '945-678-901-000', 'remarks' => 'Mixing agents & chemicals'],
            ['name' => 'CoolMint International', 'address' => 'Pasay City', 'tin' => '956-789-012-000', 'remarks' => 'Menthol-based ingredients'],
            ['name' => 'PrintWorks Labeling', 'address' => 'Mandaluyong City', 'tin' => '967-890-123-000', 'remarks' => 'Product label printing'],
            ['name' => 'TubeTech Packaging', 'address' => 'San Pedro, Laguna', 'tin' => '978-901-234-000', 'remarks' => 'Aluminum & plastic tubes'],
            ['name' => 'EcoCap Manufacturing', 'address' => 'Valenzuela City', 'tin' => '989-012-345-000', 'remarks' => 'Eco-friendly caps'],
            ['name' => 'HerbalPure Essentials', 'address' => 'Antipolo City', 'tin' => '990-123-456-000', 'remarks' => 'Essential oils supplier'],
            ['name' => 'BlendWell Pharma', 'address' => 'Manila', 'tin' => '991-234-567-000', 'remarks' => 'Pharmaceutical-grade blends'],
            ['name' => 'AromaTech Solutions', 'address' => 'Quezon City', 'tin' => '992-345-678-000', 'remarks' => 'Scent technology supplier'],
            ['name' => 'CoolBreeze Chemicals', 'address' => 'Pasig City', 'tin' => '993-456-789-000', 'remarks' => 'Cooling agent supplier'],
            ['name' => 'PolySeal Enterprises', 'address' => 'Malabon City', 'tin' => '994-567-890-000', 'remarks' => 'Shrink wrap & seals'],
            ['name' => 'MenthaFresh Trading', 'address' => 'Cavite', 'tin' => '995-678-901-000', 'remarks' => 'Mint leaves & menthol'],
            ['name' => 'FreshBlend Organics', 'address' => 'Bulacan', 'tin' => '996-789-012-000', 'remarks' => 'Organic herbal powders'],
            ['name' => 'FlexiPack Manufacturing', 'address' => 'Laguna', 'tin' => '997-890-123-000', 'remarks' => 'Flexible packaging'],
            ['name' => 'BotaniCare Extracts', 'address' => 'Batangas', 'tin' => '998-901-234-000', 'remarks' => 'Botanical extracts'],
            ['name' => 'MentholMax Chemicals', 'address' => 'Cavite', 'tin' => '999-012-345-000', 'remarks' => 'Menthol powder supplier'],
            ['name' => 'PureBlend Pharma', 'address' => 'Makati City', 'tin' => '111-222-333-000', 'remarks' => 'Pharma-grade blending services'],
            ['name' => 'LeafLine Traders', 'address' => 'Quezon City', 'tin' => '222-333-444-000', 'remarks' => 'Herbal raw materials'],
            ['name' => 'AromaPlus Industries', 'address' => 'Parañaque City', 'tin' => '333-444-555-000', 'remarks' => 'Aromatic oils supplier'],
        ];

        DB::table('vendors')->insert($vendors);
    }
}
