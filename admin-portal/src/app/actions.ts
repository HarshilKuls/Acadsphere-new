"use server";

import { createClient } from '@supabase/supabase-js';
import { hashPassword } from '../lib/db';

export async function registerAdminAction(
  adminToken: string,
  formData: {
    fullName: string;
    email: string;
    role: 'Master Admin' | 'Normal Admin';
    permissions: {
      manageContent: boolean;
      manageUsers: boolean;
    };
    passwordPlain: string;
  }
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      success: false,
      error: "SUPABASE_SERVICE_ROLE_KEY is not configured in .env.local on the server."
    };
  }

  // Create an admin supabase client
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // Verify administrator token and role
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(adminToken);
  if (authError || !user) {
    return {
      success: false,
      error: "Access Denied: Unauthenticated admin user."
    };
  }

  const { data: adminRecord, error: adminError } = await supabaseAdmin
    .from('admins')
    .select('role')
    .eq('id', user.id)
    .single();

  if (adminError || !adminRecord || adminRecord.role !== 'Master Admin') {
    return {
      success: false,
      error: "Access Denied: Master Admin privileges required to create administrators."
    };
  }

  // 1. Create user in auth.users
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: formData.email.toLowerCase(),
    password: formData.passwordPlain,
    email_confirm: true,
    user_metadata: {
      full_name: formData.fullName,
      role: formData.role
    }
  });

  if (error) {
    return {
      success: false,
      error: error.message || "Failed to create authentication account."
    };
  }

  const userId = data.user.id;

  try {
    const enteredHash = await hashPassword(formData.passwordPlain);

    // 2. Insert user in admins table
    const { error: dbError } = await supabaseAdmin
      .from('admins')
      .insert({
        id: userId,
        full_name: formData.fullName,
        email: formData.email.toLowerCase(),
        role: formData.role,
        manage_content: formData.permissions.manageContent,
        manage_users: formData.permissions.manageUsers,
        password_hash: enteredHash
      });

    if (dbError) {
      // Rollback: delete authentication user
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return {
        success: false,
        error: dbError.message || "Database insert failed. Rollback triggered."
      };
    }

    return {
      success: true,
      admin: {
        id: userId,
        fullName: formData.fullName,
        email: formData.email.toLowerCase(),
        role: formData.role,
        permissions: formData.permissions,
        passwordHash: enteredHash
      }
    };
  } catch (err: any) {
    // Rollback: delete authentication user
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return {
      success: false,
      error: err.message || "An unexpected error occurred during database setup. Rollback triggered."
    };
  }
}
