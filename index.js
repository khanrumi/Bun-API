// index.js
import { serve } from "bun";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = "https://wlcqmxxjwrgadsribxev.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsY3FteHhqd3JnYWRzcmlieGV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxNTA1NjQsImV4cCI6MjA0NDcyNjU2NH0.IVBJfPL_y1kp_mInj8JAdrpGRr76_B8sCAWvQRkd1mY";
const supabase = createClient(supabaseUrl, supabaseKey);

const server = serve({
    port: 3000,
    async fetch(req) {
      const url = new URL(req.url);
  
      // Sign Up
      if (req.method === "POST" && url.pathname === "/signup") {
        const { email, password } = await req.json();
        const { user, error } = await supabase.auth.signUp({ email, password });
        if (error) return new Response(JSON.stringify(error), { status: 400 });
        return new Response(JSON.stringify(user), {
          headers: { "Content-Type": "application/json" },
          status: 201,
        });
      }
  
      // Sign In
      if (req.method === "POST" && url.pathname === "/signin") {
        const { email, password } = await req.json();
        const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return new Response(JSON.stringify(error), { status: 400 });
        return new Response(JSON.stringify(user), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        });
      }


    // Add User
if (req.method === "POST" && url.pathname === "/addUser") {
    const users = await req.json(); // Expecting an array of user objects
    const insertResults = [];
  
    for (const { email, name } of users) {
      // Check if the user already exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('users') // Replace 'users' with your actual table name
        .select('*')
        .eq('email', email)
        .single();
  
      if (fetchError && fetchError.code !== 'PGRST116') {
        return new Response(JSON.stringify(fetchError), { status: 400 });
      }
  
      if (existingUser) {
        insertResults.push({ email, message: "User already exists" });
      } else {
        // Add the new user to the database
        const { error: insertError } = await supabase
          .from('users') // Replace 'users' with your actual table name
          .insert([{ email, name }]); // Adjust this based on your table structure
  
        if (insertError) {
          return new Response(JSON.stringify(insertError), { status: 400 });
        }
  
        insertResults.push({ email, message: "User added successfully" });
      }
    }
  
    return new Response(JSON.stringify(insertResults), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
  }
  
  
      // Other endpoints (like GET /users and POST /users) go here...
  
      return new Response("Not Found", { status: 404 });
    },
  });
  
  console.log("Server running on http://localhost:3000");