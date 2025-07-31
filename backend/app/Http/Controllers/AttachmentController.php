<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attachment;
use Illuminate\Support\Facades\Auth;

class AttachmentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'ref_id' => 'required|exists:canvass_sheets,id',
            'file' => 'required|file',
        ]);

        $file = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('attachments', $filename, 'public');

        $attachment = Attachment::create([
            'ref_id' => $request->ref_id,
            'file_name' => $file->getClientOriginalName(),
            'path' => $path,
            'added_by' => Auth::user()->username,
        ]);

        return response()->json($attachment, 201);
    }

     public function index($ref_id)
    {
        return Attachment::where('ref_id', $ref_id)->get();
    }
}
