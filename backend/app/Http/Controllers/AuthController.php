<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // POST /api/v1/auth/customer/register
    public function registerCustomer(Request $request)
    {
        $request->validate([
            'phoneNumber' => 'required',
            'password' => 'required|min:6',
        ]);

        $phoneNumber = $request->input('phoneNumber');

        $userExists = User::where('phone_number', $phoneNumber)->first();
        if ($userExists) {
            return response()->json([
                'success' => false,
                'message' => 'User already exists with this mobile number'
            ], 400);
        }

        $user = User::create([
            'name' => $request->input('name'),
            'phone_number' => $phoneNumber,
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
        ]);

        $token = $user->createToken('customer_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token,
            'data' => $user
        ], 201);
    }

    // POST /api/v1/auth/customer/login
    public function loginCustomer(Request $request)
    {
        $request->validate([
            'phoneNumber' => 'required',
            'password' => 'required',
        ]);

        $phoneNumber = $request->input('phoneNumber');
        $password = $request->input('password');

        $user = User::where('phone_number', $phoneNumber)->where('is_deleted', false)->first();
        if (!$user || !Hash::check($password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        $token = $user->createToken('customer_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token,
            'data' => $user
        ], 200);
    }

    // GET /api/v1/auth/customer/me
    public function getMe(Request $request)
    {
        $user = $request->user();
        if (!$user || !$user instanceof User) {
            return response()->json([
                'success' => false,
                'message' => 'Not authorized as customer'
            ], 401);
        }

        // Load addresses as well, just like Mongoose populate
        $user->load('addresses');

        return response()->json([
            'success' => true,
            'data' => $user
        ], 200);
    }

    // POST /api/v1/auth/admin/login
    public function adminLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $email = $request->input('email');
        $password = $request->input('password');

        $admin = Admin::where('email', $email)->where('is_deleted', false)->first();
        if (!$admin || !Hash::check($password, $admin->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        $token = $admin->createToken('admin_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token,
            'admin' => [
                'id' => (string) $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role
            ]
        ], 200);
    }
}
