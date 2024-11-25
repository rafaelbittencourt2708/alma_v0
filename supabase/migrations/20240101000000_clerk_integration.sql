-- Add Clerk ID to organizations table
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS clerk_id text UNIQUE;

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their organizations" ON organizations;
DROP POLICY IF EXISTS "Organization admins can update their organizations" ON organizations;
DROP POLICY IF EXISTS "Users can view members of their organizations" ON organization_members;
DROP POLICY IF EXISTS "Organization admins can manage members" ON organization_members;

-- Create RLS Policies for organizations
CREATE POLICY "Users can view their organizations"
  ON organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id
      FROM organization_members
      WHERE user_id = auth.uid()
      AND active = true
    )
  );

CREATE POLICY "Organization admins can update their organizations"
  ON organizations FOR UPDATE
  USING (
    id IN (
      SELECT organization_id
      FROM organization_members
      WHERE user_id = auth.uid()
      AND role = 'admin'
      AND active = true
    )
  );

-- Create RLS Policies for organization_members
CREATE POLICY "Users can view members of their organizations"
  ON organization_members FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM organization_members
      WHERE user_id = auth.uid()
      AND active = true
    )
  );

CREATE POLICY "Organization admins can manage members"
  ON organization_members FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id
      FROM organization_members
      WHERE user_id = auth.uid()
      AND role = 'admin'
      AND active = true
    )
  );

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_user_organizations(UUID);

-- Create function to get user's organizations
CREATE OR REPLACE FUNCTION get_user_organizations(p_user_id UUID)
RETURNS TABLE (
    id UUID,
    name TEXT,
    slug TEXT,
    clerk_id TEXT,
    role TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id,
        o.name,
        o.slug,
        o.clerk_id,
        om.role
    FROM organizations o
    JOIN organization_members om ON o.id = om.organization_id
    WHERE om.user_id = p_user_id
    AND om.active = true
    AND o.active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
