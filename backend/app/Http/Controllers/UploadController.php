<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UploadController extends Controller
{
    // POST /api/v1/upload
    public function uploadImage(Request $request)
    {
        try {
            if (!$request->hasFile('image')) {
                return response()->json([
                    'success' => false,
                    'message' => 'No file uploaded'
                ], 400);
            }

            $file = $request->file('image');
            
            // Validate image type & size
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
            $extension = strtolower($file->getClientOriginalExtension());
            if (!in_array($extension, $allowedExtensions)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Images only! (jpg, jpeg, png, webp)'
                ], 400);
            }

            if ($file->getSize() > 5000000) { // 5MB limit
                return response()->json([
                    'success' => false,
                    'message' => 'File size exceeds 5MB limit'
                ], 400);
            }

            $filename = 'image-' . time() . '.' . $extension;
            
            // Ensure public/uploads directory exists
            $uploadDir = public_path('uploads');
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $file->move($uploadDir, $filename);
            
            $fileUrl = '/uploads/' . $filename;

            return response()->json([
                'success' => true,
                'data' => $fileUrl,
                'message' => 'Image uploaded'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
