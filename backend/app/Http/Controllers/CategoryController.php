<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // Helper to check admin authorization
    private function authorizeAdmin()
    {
        $user = auth()->user();
        if (!$user || !$user instanceof \App\Models\Admin) {
            return false;
        }
        return true;
    }

    // GET /api/v1/categories
    public function getCategories()
    {
        try {
            $categories = Category::where('is_deleted', false)->get();
            return response()->json([
                'success' => true,
                'count' => $categories->count(),
                'data' => $categories
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // POST /api/v1/categories
    public function createCategory(Request $request)
    {
        if (!$this->authorizeAdmin()) {
            return response()->json(['success' => false, 'message' => 'Not authorized as admin'], 401);
        }

        try {
            $category = Category::create($request->all());
            return response()->json([
                'success' => true,
                'data' => $category
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    // PUT /api/v1/categories/:id
    public function updateCategory(Request $request, $id)
    {
        if (!$this->authorizeAdmin()) {
            return response()->json(['success' => false, 'message' => 'Not authorized as admin'], 401);
        }

        try {
            $category = Category::findOrFail($id);
            $category->update($request->all());
            return response()->json([
                'success' => true,
                'data' => $category
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Category not found or invalid input'], 404);
        }
    }

    // DELETE /api/v1/categories/:id
    public function deleteCategory($id)
    {
        if (!$this->authorizeAdmin()) {
            return response()->json(['success' => false, 'message' => 'Not authorized as admin'], 401);
        }

        try {
            $category = Category::findOrFail($id);
            $category->update(['is_deleted' => true]);
            return response()->json([
                'success' => true,
                'data' => (object)[]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Category not found'], 404);
        }
    }
}
