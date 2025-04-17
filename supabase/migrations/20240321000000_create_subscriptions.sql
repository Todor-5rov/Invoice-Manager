-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'paid')),
    monthly_upload_limit INTEGER NOT NULL DEFAULT 5,
    uploads_used INTEGER NOT NULL DEFAULT 0,
    last_reset_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_customer_id_idx ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_subscription_id_idx ON subscriptions(stripe_subscription_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own subscription"
    ON subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
    ON subscriptions FOR UPDATE
    USING (auth.uid() = user_id);

-- Create function to reset monthly uploads
CREATE OR REPLACE FUNCTION reset_monthly_uploads()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.last_reset_date < CURRENT_TIMESTAMP - INTERVAL '1 month' THEN
        NEW.uploads_used = 0;
        NEW.last_reset_date = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to reset monthly uploads
CREATE TRIGGER reset_monthly_uploads_trigger
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION reset_monthly_uploads(); 