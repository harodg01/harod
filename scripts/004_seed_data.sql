-- This script will be run after users are created
-- Insert sample patients (will be added after authentication is set up)
-- Note: created_by will need to be updated with actual user IDs

INSERT INTO public.patients (first_name, last_name, date_of_birth, gender, blood_type, phone, email, address, medical_history, allergies)
VALUES
  ('John', 'Doe', '1985-03-15', 'male', 'A+', '555-0101', 'john.doe@email.com', '123 Main St, City, State 12345', 'Hypertension, Type 2 Diabetes', 'Penicillin'),
  ('Jane', 'Smith', '1990-07-22', 'female', 'O-', '555-0102', 'jane.smith@email.com', '456 Oak Ave, City, State 12345', 'Asthma', 'None'),
  ('Robert', 'Johnson', '1978-11-30', 'male', 'B+', '555-0103', 'robert.j@email.com', '789 Pine Rd, City, State 12345', 'None', 'Latex'),
  ('Maria', 'Garcia', '1995-05-18', 'female', 'AB+', '555-0104', 'maria.g@email.com', '321 Elm St, City, State 12345', 'Migraine', 'Sulfa drugs'),
  ('Michael', 'Brown', '1982-09-08', 'male', 'O+', '555-0105', 'michael.b@email.com', '654 Maple Dr, City, State 12345', 'High cholesterol', 'None')
ON CONFLICT DO NOTHING;
