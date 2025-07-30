<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('canvass_item_vendor', function (Blueprint $table) {
            $table->id();
            $table->foreignId('canvass_item_id')->constrained()->onDelete('cascade');
            $table->foreignId('quote_id')->nullable()->constrained('vendor_quote')->onDelete('set null');
            $table->integer('stock');
            $table->integer('qty_order');
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('canvass_item_vendor');
    }
};
