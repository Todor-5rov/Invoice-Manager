// Import the serverSupabaseServiceRole from the Supabase module
import { serverSupabaseServiceRole } from '#supabase/server'

// Simple endpoint to keep the Supabase connection alive
// This will be called daily via a Vercel cron job
// Uses service role client with admin privileges to check auth.users

export default defineEventHandler(async (event) => {
  try {
    // Use the Supabase service role client for admin access
    const serviceClient = serverSupabaseServiceRole(event)
    
    // Use auth admin API to list users instead of querying public.users
    const { data: users, error } = await serviceClient.auth.admin.listUsers({
      page: 1,
      perPage: 5
    })
    
    if (error) {
      console.error('Error in keepSupabaseAlive cron job:', error.message)
      return { success: false, message: error.message }
    }
    
    const userCount = users?.users?.length || 0
    console.log(`Successfully pinged Supabase auth system. Found ${userCount} users.`)
    
    return { 
      success: true, 
      timestamp: new Date().toISOString(),
      userCount
    }
  } catch (err) {
    console.error('Unexpected error in keepSupabaseAlive cron job:', err)
    return { success: false, message: err.message }
  }
})
