<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    // GET /api/v1/invoices/:orderId
    public function generateInvoice($orderId)
    {
        $user = auth()->user();
        if (!$user || !$user instanceof \App\Models\Admin) {
            return response()->json(['success' => false, 'message' => 'Not authorized as admin'], 401);
        }

        try {
            $order = Order::with(['userRelation', 'itemsRelation'])->findOrFail($orderId);

            // Generate high-fidelity PDF from invoice Blade view
            $pdf = Pdf::loadView('invoice', compact('order'));
            
            // Set headers for standard PDF download
            return $pdf->download("invoice-{$order->id}.pdf");
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
