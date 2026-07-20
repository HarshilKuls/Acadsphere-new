const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lrtywitlsyzkzsdhsnfv.supabase.co';
const supabaseAnonKey = 'sb_publishable_HrppIfWqMLrGhameXHZclg_7-arfioj';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runTests() {
  console.log("====================================================");
  console.log("⚡ ACADSPHERE SUPABASE SYNC VERIFIER");
  console.log("====================================================");
  console.log("Connecting to Supabase at:", supabaseUrl);
  
  // 1. Query events table
  console.log("\n1. Fetching live broadcast events...");
  const { data: events, error: evError } = await supabase.from('events').select('id, title, category').limit(3);
  if (evError) {
    console.error("❌ Failed to query events table:", evError.message);
  } else {
    console.log(`✅ Successfully queried events! Found ${events.length} recent records:`);
    events.forEach(e => console.log(`   - [${e.category}] ${e.title} (ID: ${e.id})`));
  }

  // 2. Query internships table
  console.log("\n2. Fetching active internships feed...");
  const { data: internships, error: intError } = await supabase.from('internships').select('id, title, company_name').limit(3);
  if (intError) {
    console.error("❌ Failed to query internships table:", intError.message);
  } else {
    console.log(`✅ Successfully queried internships! Found ${internships.length} recent records:`);
    internships.forEach(i => console.log(`   - ${i.title} at ${i.company_name} (ID: ${i.id})`));
  }

  // 3. Query e-library table
  console.log("\n3. Fetching academic e-library index...");
  const { data: library, error: libError } = await supabase.from('e_library').select('id, title, category').limit(3);
  if (libError) {
    console.error("❌ Failed to query e_library table:", libError.message);
  } else {
    console.log(`✅ Successfully queried e-library! Found ${library.length} recent records:`);
    library.forEach(l => console.log(`   - [${l.category}] ${l.title} (ID: ${l.id})`));
  }

  // 4. Query student profiles table (Non-Confidential fields only)
  console.log("\n4. Fetching registered student profiles (Non-Confidential fields)...");
  const { data: profiles, error: profError } = await supabase.from('profiles').select('full_name, college, email, created_at').limit(3);
  if (profError) {
    console.error("❌ Failed to query profiles table:", profError.message);
  } else {
    console.log(`✅ Successfully queried profiles! Found ${profiles.length} total registered students:`);
    profiles.forEach(p => console.log(`   - ${p.full_name} (${p.college}) • ${p.email} • Joined: ${new Date(p.created_at).toLocaleDateString()}`));
  }

  // 5. Query banned users registry
  console.log("\n5. Fetching banned/suspended student emails...");
  const { data: banned, error: banError } = await supabase.from('banned_users').select('email, reason, created_at').limit(3);
  if (banError) {
    console.error("❌ Failed to query banned_users table:", banError.message);
  } else {
    console.log(`✅ Successfully queried banned users registry! Found ${banned.length} suspended accounts:`);
    banned.forEach(b => console.log(`   - BANNED: ${b.email} • Reason: "${b.reason}"`));
  }

  console.log("\n====================================================");
  console.log("⚡ END OF SYNC VERIFICATION LOGS");
  console.log("====================================================");
}

runTests();
