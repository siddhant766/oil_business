<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserAddress;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    private function getAuthenticatedCustomer()
    {
        $user = auth()->user();
        if (!$user || !$user instanceof User) {
            return null;
        }
        return $user;
    }

    // PUT /api/v1/users/profile
    public function updateProfile(Request $request)
    {
        $user = $this->getAuthenticatedCustomer();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Not authorized'], 401);
        }

        try {
            $data = [];
            if ($request->has('name')) $data['name'] = $request->input('name');
            if ($request->has('email')) $data['email'] = $request->input('email');
            if ($request->has('businessName')) $data['business_name'] = $request->input('businessName');
            if ($request->has('gstNumber')) $data['gst_number'] = $request->input('gstNumber');
            
            if ($request->has('password') && !empty($request->input('password'))) {
                $data['password'] = Hash::make($request->input('password'));
            }

            $user->update($data);

            return response()->json([
                'success' => true,
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // POST /api/v1/users/addresses
    public function addAddress(Request $request)
    {
        $user = $this->getAuthenticatedCustomer();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Not authorized'], 401);
        }

        try {
            $type = $request->input('type', 'Home');
            $addressLine1 = $request->input('addressLine1');
            $city = $request->input('city');
            $state = $request->input('state');
            $pincode = $request->input('pincode');
            $isDefault = $request->input('isDefault', false);

            $existingAddresses = UserAddress::where('user_id', $user->id)->get();

            // Force default if it's the first address
            if ($isDefault || $existingAddresses->isEmpty()) {
                $isDefault = true;
                // Unset other defaults
                UserAddress::where('user_id', $user->id)->update(['is_default' => false]);
            }

            UserAddress::create([
                'user_id' => $user->id,
                'type' => $type,
                'address_line_1' => $addressLine1,
                'city' => $city,
                'state' => $state,
                'pincode' => $pincode,
                'is_default' => $isDefault
            ]);

            // Return updated list of addresses
            $addresses = UserAddress::where('user_id', $user->id)->get();

            return response()->json([
                'success' => true,
                'data' => $addresses
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // PUT /api/v1/users/addresses/:id
    public function updateAddress(Request $request, $id)
    {
        $user = $this->getAuthenticatedCustomer();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Not authorized'], 401);
        }

        try {
            $address = UserAddress::where('user_id', $user->id)->findOrFail($id);

            $data = [];
            if ($request->has('type')) $data['type'] = $request->input('type');
            if ($request->has('addressLine1')) $data['address_line_1'] = $request->input('addressLine1');
            if ($request->has('city')) $data['city'] = $request->input('city');
            if ($request->has('state')) $data['state'] = $request->input('state');
            if ($request->has('pincode')) $data['pincode'] = $request->input('pincode');

            if ($request->has('isDefault')) {
                $isDefault = $request->input('isDefault');
                if ($isDefault) {
                    UserAddress::where('user_id', $user->id)->update(['is_default' => false]);
                    $data['is_default'] = true;
                } else {
                    $data['is_default'] = false;
                }
            }

            $address->update($data);

            $addresses = UserAddress::where('user_id', $user->id)->get();
            return response()->json([
                'success' => true,
                'data' => $addresses
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // DELETE /api/v1/users/addresses/:id
    public function deleteAddress($id)
    {
        $user = $this->getAuthenticatedCustomer();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Not authorized'], 401);
        }

        try {
            $address = UserAddress::where('user_id', $user->id)->findOrFail($id);
            $wasDefault = $address->is_default;
            $address->delete();

            $addresses = UserAddress::where('user_id', $user->id)->get();

            // If we deleted the default address, set the first remaining one to default
            if ($wasDefault && $addresses->isNotEmpty()) {
                $addresses->first()->update(['is_default' => true]);
                // Refresh list
                $addresses = UserAddress::where('user_id', $user->id)->get();
            }

            return response()->json([
                'success' => true,
                'data' => $addresses
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // GET /api/v1/users/wishlist
    public function getWishlist()
    {
        $user = $this->getAuthenticatedCustomer();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Not authorized'], 401);
        }

        try {
            $wishlist = $user->wishlist()->with(['categoryRelation', 'variants'])->get();
            return response()->json([
                'success' => true,
                'data' => $wishlist
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // POST /api/v1/users/wishlist
    public function toggleWishlist(Request $request)
    {
        $user = $this->getAuthenticatedCustomer();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Not authorized'], 401);
        }

        $productId = $request->input('productId');
        if (!$productId) {
            return response()->json(['success' => false, 'message' => 'Product ID is required'], 400);
        }

        try {
            $user->wishlist()->toggle($productId);

            // Populate wishlist with category and variants
            $wishlist = $user->wishlist()->with(['categoryRelation', 'variants'])->get();

            return response()->json([
                'success' => true,
                'data' => $wishlist
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
