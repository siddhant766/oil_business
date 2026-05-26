<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Tax Invoice</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            line-height: 1.4;
            margin: 0;
            padding: 0;
        }
        .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            font-size: 14px;
        }
        .text-center {
            text-align: center;
        }
        .text-right {
            text-align: right;
        }
        .header-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 2px;
            color: #111;
        }
        .company-details {
            font-size: 11px;
            color: #666;
            margin-bottom: 30px;
        }
        .tax-invoice-label {
            font-size: 18px;
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 25px;
            letter-spacing: 1px;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .info-table td {
            vertical-align: top;
            padding-bottom: 10px;
        }
        .info-table td.label {
            font-weight: bold;
            color: #555;
            width: 120px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .items-table th {
            background-color: #f5f5f5;
            border-top: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
            padding: 10px;
            font-size: 12px;
            text-align: left;
        }
        .items-table td {
            padding: 12px 10px;
            border-bottom: 1px solid #eee;
            font-size: 13px;
        }
        .items-table th.right-align, .items-table td.right-align {
            text-align: right;
        }
        .total-section {
            border-top: 2px solid #ddd;
            padding-top: 15px;
            margin-top: 20px;
        }
        .total-amount {
            font-size: 18px;
            font-weight: bold;
            color: #111;
        }
    </style>
</head>
<body>
    <div class="invoice-box">
        <div class="text-center">
            <div class="header-title">Premium Oils Distribution</div>
            <div class="company-details">123 Industrial Area, Phase 1, New Delhi, India 110020</div>
            <div class="tax-invoice-label">TAX INVOICE</div>
        </div>

        <table class="info-table">
            <tr>
                <td style="width: 55%;">
                    <table>
                        <tr>
                            <td class="label">Customer Name:</td>
                            <td>{{ $order->userRelation->business_name ?? $order->userRelation->name ?? 'Guest' }}</td>
                        </tr>
                        <tr>
                            <td class="label">Phone:</td>
                            <td>{{ $order->userRelation->phone_number ?? 'N/A' }}</td>
                        </tr>
                        @if(!empty($order->userRelation->gst_number))
                        <tr>
                            <td class="label">GST No:</td>
                            <td>{{ $order->userRelation->gst_number }}</td>
                        </tr>
                        @endif
                    </table>
                </td>
                <td style="width: 45%;">
                    <table>
                        <tr>
                            <td class="label">Order ID:</td>
                            <td>{{ $order->id }}</td>
                        </tr>
                        <tr>
                            <td class="label">Date:</td>
                            <td>{{ $order->created_at->format('d/m/Y') }}</td>
                        </tr>
                        <tr>
                            <td class="label">Payment:</td>
                            <td>{{ $order->payment_method ?? 'COD' }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Item Description</th>
                    <th class="right-align" style="width: 10%;">Qty</th>
                    <th class="right-align" style="width: 20%;">Price</th>
                    <th class="right-align" style="width: 25%;">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->itemsRelation as $item)
                <tr>
                    <td>{{ $item->name }} ({{ $item->size }})</td>
                    <td class="right-align">{{ $item->quantity }}</td>
                    <td class="right-align">Rs {{ number_format($item->price, 2) }}</td>
                    <td class="right-align">Rs {{ number_format($item->quantity * $item->price, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="text-right total-section">
            <span style="font-size: 14px; color: #555; font-weight: bold; margin-right: 15px;">Total Amount:</span>
            <span class="total-amount">Rs {{ number_format($order->total_amount, 2) }}</span>
        </div>
    </div>
</body>
</html>
