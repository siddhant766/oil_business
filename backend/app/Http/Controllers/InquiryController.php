<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    private function authorizeAdmin()
    {
        $user = auth()->user();
        if (!$user || !$user instanceof \App\Models\Admin) {
            return false;
        }
        return true;
    }

    // POST /api/v1/inquiries
    public function createInquiry(Request $request)
    {
        $request->validate([
            'businessName' => 'required',
            'contactPerson' => 'required',
            'email' => 'required|email',
            'phone' => 'required',
            'address' => 'required',
            'estimatedOrderQuantity' => 'required'
        ]);

        try {
            $inquiry = Inquiry::create([
                'business_name' => $request->input('businessName'),
                'contact_person' => $request->input('contactPerson'),
                'email' => $request->input('email'),
                'phone' => $request->input('phone'),
                'gst_number' => $request->input('gstNumber'),
                'address' => $request->input('address'),
                'estimated_order_quantity' => $request->input('estimatedOrderQuantity'),
                'message' => $request->input('message'),
                'status' => 'Pending'
            ]);

            return response()->json([
                'success' => true,
                'data' => $inquiry
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    // GET /api/v1/inquiries
    public function getInquiries()
    {
        if (!$this->authorizeAdmin()) {
            return response()->json(['success' => false, 'message' => 'Not authorized as admin'], 401);
        }

        try {
            $inquiries = Inquiry::orderBy('created_at', 'desc')->get();
            return response()->json([
                'success' => true,
                'count' => $inquiries->count(),
                'data' => $inquiries
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // PUT /api/v1/inquiries/:id/status
    public function updateInquiryStatus(Request $request, $id)
    {
        if (!$this->authorizeAdmin()) {
            return response()->json(['success' => false, 'message' => 'Not authorized as admin'], 401);
        }

        try {
            $status = $request->input('status');
            $inquiry = Inquiry::findOrFail($id);
            $inquiry->update(['status' => $status]);

            return response()->json([
                'success' => true,
                'data' => $inquiry
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
