import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function createOrUpdateOrganization(org: any) {
  console.log('Creating/updating organization:', JSON.stringify(org, null, 2));
  
  const { data: existingOrg, error: selectError } = await supabase
    .from('organizations')
    .select()
    .eq('clerk_id', org.id)
    .single();

  console.log('Existing org check result:', { existingOrg, selectError });

  if (selectError && selectError.code !== 'PGRST116') {
    console.error('Error checking existing organization:', selectError);
    throw selectError;
  }

  if (existingOrg) {
    console.log('Updating existing organization');
    const { data: updateData, error: updateError } = await supabase
      .from('organizations')
      .update({
        name: org.name,
        slug: org.slug || org.name.toLowerCase().replace(/\s+/g, '-'),
        updated_at: new Date().toISOString(),
      })
      .eq('clerk_id', org.id)
      .select();

    console.log('Update result:', { updateData, updateError });

    if (updateError) {
      console.error('Error updating organization:', updateError);
      throw updateError;
    }
  } else {
    console.log('Creating new organization');
    const newOrg = {
      clerk_id: org.id,
      name: org.name,
      slug: org.slug || org.name.toLowerCase().replace(/\s+/g, '-'),
      active: true,
      type: 'clinic',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('New organization data:', newOrg);

    const { data: insertData, error: insertError } = await supabase
      .from('organizations')
      .insert([newOrg])
      .select();

    console.log('Insert result:', { insertData, insertError });

    if (insertError) {
      console.error('Error inserting organization:', insertError);
      throw insertError;
    }
  }
}

async function createOrUpdateMembership(org_id: string, membership: any) {
  console.log('Creating/updating membership:', JSON.stringify({ org_id, membership }, null, 2));

  // First ensure the organization exists
  await createOrUpdateOrganization(membership.organization);
  
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('id')
    .eq('clerk_id', org_id)
    .single();

  console.log('Organization lookup result:', { organization, orgError });

  if (orgError) {
    console.error('Error fetching organization:', orgError);
    throw orgError;
  }

  if (!organization) {
    console.error('Organization not found:', org_id);
    return;
  }

  const { data: existingMember, error: memberError } = await supabase
    .from('organization_members')
    .select()
    .eq('organization_id', organization.id)
    .eq('user_id', membership.public_user_data.user_id)
    .single();

  console.log('Existing member check result:', { existingMember, memberError });

  if (memberError && memberError.code !== 'PGRST116') {
    console.error('Error checking existing member:', memberError);
    throw memberError;
  }

  const memberData = {
    organization_id: organization.id,
    user_id: membership.public_user_data.user_id,
    role: membership.role === 'org:admin' ? 'admin' : 'member',
    active: true,
    name: membership.public_user_data.first_name 
      ? `${membership.public_user_data.first_name} ${membership.public_user_data.last_name || ''}`
      : undefined,
    email: membership.public_user_data.email_addresses?.[0]?.email_address,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  console.log('Member data to insert/update:', memberData);

  if (existingMember) {
    console.log('Updating existing member');
    const { data: updateData, error: updateError } = await supabase
      .from('organization_members')
      .update({
        ...memberData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingMember.id)
      .select();

    console.log('Member update result:', { updateData, updateError });

    if (updateError) {
      console.error('Error updating member:', updateError);
      throw updateError;
    }
  } else {
    console.log('Creating new member');
    const { data: insertData, error: insertError } = await supabase
      .from('organization_members')
      .insert([memberData])
      .select();

    console.log('Member insert result:', { insertData, insertError });

    if (insertError) {
      console.error('Error inserting member:', insertError);
      throw insertError;
    }
  }
}

export async function POST(req: Request) {
  console.log('Received webhook event');
  
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature || !webhookSecret) {
    console.error('Missing svix headers:', { svix_id, svix_timestamp, svix_signature, webhookSecret });
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  console.log('Webhook payload:', JSON.stringify(payload, null, 2));

  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  const eventType = evt.type;
  console.log('Event type:', eventType);

  try {
    if (eventType === 'organization.created' || eventType === 'organization.updated') {
      await createOrUpdateOrganization(evt.data);
    } else if (
      eventType === 'organizationMembership.created' ||
      eventType === 'organizationMembership.updated'
    ) {
      await createOrUpdateMembership(evt.data.organization.id, evt.data);
    }

    return new Response('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Error processing webhook: ' + JSON.stringify(error), { status: 500 });
  }
}
