-- Create storage bucket for medical files
INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-files', 'medical-files', false)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for medical files bucket
CREATE POLICY "Healthcare staff can view medical files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'medical-files' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'doctor', 'nurse')
  )
);

CREATE POLICY "Healthcare staff can upload medical files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'medical-files' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'doctor', 'nurse')
  )
);

CREATE POLICY "Only admins can delete medical files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'medical-files' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
