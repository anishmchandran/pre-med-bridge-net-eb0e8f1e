--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'student',
    'lab',
    'clinic',
    'admin'
);


--
-- Name: application_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.application_status AS ENUM (
    'pending',
    'accepted',
    'rejected',
    'withdrawn'
);


--
-- Name: experience_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.experience_type AS ENUM (
    'clinical',
    'research',
    'volunteer',
    'shadowing',
    'other'
);


--
-- Name: opportunity_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.opportunity_category AS ENUM (
    'research',
    'clinical',
    'volunteer',
    'shadowing',
    'data'
);


--
-- Name: opportunity_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.opportunity_status AS ENUM (
    'draft',
    'active',
    'closed'
);


--
-- Name: verification_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.verification_status AS ENUM (
    'pending',
    'verified',
    'rejected',
    'self_logged'
);


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  
  -- Assign default role as student
  insert into public.user_roles (user_id, role)
  values (new.id, 'student');
  
  return new;
end;
$$;


--
-- Name: handle_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_updated_at() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;


SET default_table_access_method = heap;

--
-- Name: applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    opportunity_id uuid NOT NULL,
    user_id uuid NOT NULL,
    status public.application_status DEFAULT 'pending'::public.application_status,
    cover_letter text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT applications_cover_letter_length_check CHECK (((cover_letter IS NULL) OR (length(cover_letter) <= 5000)))
);


--
-- Name: certifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.certifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    certification_type text NOT NULL,
    certification_name text NOT NULL,
    issue_date date,
    expiration_date date,
    document_url text,
    verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: education; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.education (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    school_name text NOT NULL,
    degree text NOT NULL,
    major text NOT NULL,
    graduation_year integer,
    gpa numeric(3,2),
    gpa_visible boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT education_degree_not_empty_check CHECK (((length(TRIM(BOTH FROM degree)) >= 1) AND (length(degree) <= 200))),
    CONSTRAINT education_gpa_range_check CHECK (((gpa IS NULL) OR ((gpa >= (0)::numeric) AND (gpa <= 4.0)))),
    CONSTRAINT education_graduation_year_check CHECK (((graduation_year IS NULL) OR ((graduation_year >= 1900) AND (graduation_year <= 2100)))),
    CONSTRAINT education_major_not_empty_check CHECK (((length(TRIM(BOTH FROM major)) >= 1) AND (length(major) <= 200))),
    CONSTRAINT education_school_name_not_empty_check CHECK (((length(TRIM(BOTH FROM school_name)) >= 1) AND (length(school_name) <= 300)))
);


--
-- Name: experiences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.experiences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role_title text NOT NULL,
    organization text NOT NULL,
    start_date date NOT NULL,
    end_date date,
    is_current boolean DEFAULT false,
    description text,
    supervisor text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: hour_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hour_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    experience_type public.experience_type NOT NULL,
    organization text NOT NULL,
    role_title text NOT NULL,
    supervisor_name text,
    supervisor_email text,
    description text,
    date date NOT NULL,
    hours numeric(5,2) NOT NULL,
    verification_status public.verification_status DEFAULT 'self_logged'::public.verification_status NOT NULL,
    verifier_name text,
    verification_date timestamp with time zone,
    verification_notes text,
    location text,
    document_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT hour_logs_date_not_future_check CHECK ((date <= CURRENT_DATE)),
    CONSTRAINT hour_logs_description_length_check CHECK (((description IS NULL) OR (length(description) <= 1000))),
    CONSTRAINT hour_logs_hours_check CHECK (((hours > (0)::numeric) AND (hours <= (24)::numeric))),
    CONSTRAINT hour_logs_hours_range_check CHECK (((hours > (0)::numeric) AND (hours <= (24)::numeric))),
    CONSTRAINT hour_logs_location_length_check CHECK (((location IS NULL) OR (length(location) <= 200))),
    CONSTRAINT hour_logs_organization_not_empty_check CHECK (((length(TRIM(BOTH FROM organization)) >= 1) AND (length(organization) <= 200))),
    CONSTRAINT hour_logs_role_title_not_empty_check CHECK (((length(TRIM(BOTH FROM role_title)) >= 1) AND (length(role_title) <= 200))),
    CONSTRAINT hour_logs_supervisor_email_format_check CHECK (((supervisor_email IS NULL) OR (supervisor_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text))),
    CONSTRAINT hour_logs_supervisor_name_length_check CHECK (((supervisor_name IS NULL) OR (length(supervisor_name) <= 200)))
);


--
-- Name: lab_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lab_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    lab_name text NOT NULL,
    institution text NOT NULL,
    department text,
    website text,
    description text,
    contact_email text,
    verified boolean DEFAULT false,
    banner_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT lab_profiles_contact_email_format_check CHECK (((contact_email IS NULL) OR (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text))),
    CONSTRAINT lab_profiles_department_length_check CHECK (((department IS NULL) OR (length(department) <= 200))),
    CONSTRAINT lab_profiles_description_length_check CHECK (((description IS NULL) OR (length(description) <= 5000))),
    CONSTRAINT lab_profiles_institution_not_empty_check CHECK (((length(TRIM(BOTH FROM institution)) >= 1) AND (length(institution) <= 300))),
    CONSTRAINT lab_profiles_lab_name_not_empty_check CHECK (((length(TRIM(BOTH FROM lab_name)) >= 1) AND (length(lab_name) <= 300))),
    CONSTRAINT lab_profiles_website_url_check CHECK (((website IS NULL) OR (website ~* '^https?://'::text)))
);


--
-- Name: opportunities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.opportunities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lab_profile_id uuid NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    responsibilities text,
    category public.opportunity_category NOT NULL,
    required_certifications text[] DEFAULT '{}'::text[],
    preferred_skills text[] DEFAULT '{}'::text[],
    required_skills text[] DEFAULT '{}'::text[],
    is_paid boolean DEFAULT false,
    compensation_amount numeric,
    location text NOT NULL,
    is_remote boolean DEFAULT false,
    hours_per_week integer,
    duration_months integer,
    start_date date,
    slots_available integer DEFAULT 1,
    min_gpa numeric,
    status public.opportunity_status DEFAULT 'draft'::public.opportunity_status,
    verified boolean DEFAULT false,
    tags text[] DEFAULT '{}'::text[],
    banner_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT opportunities_compensation_amount_check CHECK (((compensation_amount IS NULL) OR (compensation_amount >= (0)::numeric))),
    CONSTRAINT opportunities_description_not_empty_check CHECK (((length(TRIM(BOTH FROM description)) >= 1) AND (length(description) <= 5000))),
    CONSTRAINT opportunities_duration_months_check CHECK (((duration_months IS NULL) OR ((duration_months > 0) AND (duration_months <= 120)))),
    CONSTRAINT opportunities_hours_per_week_check CHECK (((hours_per_week IS NULL) OR ((hours_per_week > 0) AND (hours_per_week <= 168)))),
    CONSTRAINT opportunities_location_not_empty_check CHECK (((length(TRIM(BOTH FROM location)) >= 1) AND (length(location) <= 200))),
    CONSTRAINT opportunities_min_gpa_range_check CHECK (((min_gpa IS NULL) OR ((min_gpa >= (0)::numeric) AND (min_gpa <= 4.0)))),
    CONSTRAINT opportunities_slots_available_check CHECK (((slots_available >= 1) AND (slots_available <= 1000))),
    CONSTRAINT opportunities_title_not_empty_check CHECK (((length(TRIM(BOTH FROM title)) >= 1) AND (length(title) <= 300)))
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text NOT NULL,
    full_name text,
    avatar_url text,
    bio text,
    school text,
    major text,
    year text,
    skills text[],
    weekly_availability jsonb,
    resume_url text,
    lab_name text,
    research_focus text,
    banner_url text,
    pubmed_link text,
    orcid_link text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    location text,
    graduation_year integer,
    gpa numeric(3,2),
    gpa_visible boolean DEFAULT false,
    academic_status text,
    coursework text[],
    linkedin_url text,
    verified boolean DEFAULT false,
    title text,
    department text,
    google_scholar_url text,
    institutional_profile_url text,
    CONSTRAINT profiles_bio_length_check CHECK (((bio IS NULL) OR (length(bio) <= 2000))),
    CONSTRAINT profiles_email_format_check CHECK ((email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text)),
    CONSTRAINT profiles_full_name_length_check CHECK (((full_name IS NULL) OR ((length(TRIM(BOTH FROM full_name)) >= 1) AND (length(full_name) <= 200)))),
    CONSTRAINT profiles_google_scholar_url_check CHECK (((google_scholar_url IS NULL) OR (google_scholar_url ~* '^https?://'::text))),
    CONSTRAINT profiles_gpa_range_check CHECK (((gpa IS NULL) OR ((gpa >= (0)::numeric) AND (gpa <= 4.0)))),
    CONSTRAINT profiles_graduation_year_check CHECK (((graduation_year IS NULL) OR ((graduation_year >= 1900) AND (graduation_year <= 2100)))),
    CONSTRAINT profiles_institutional_profile_url_check CHECK (((institutional_profile_url IS NULL) OR (institutional_profile_url ~* '^https?://'::text))),
    CONSTRAINT profiles_linkedin_url_check CHECK (((linkedin_url IS NULL) OR (linkedin_url ~* '^https?://'::text))),
    CONSTRAINT profiles_location_length_check CHECK (((location IS NULL) OR (length(location) <= 200))),
    CONSTRAINT profiles_orcid_link_check CHECK (((orcid_link IS NULL) OR (orcid_link ~* '^https?://'::text))),
    CONSTRAINT profiles_pubmed_link_check CHECK (((pubmed_link IS NULL) OR (pubmed_link ~* '^https?://'::text)))
);


--
-- Name: saved_opportunities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.saved_opportunities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    opportunity_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: verification_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.verification_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    hour_log_id uuid NOT NULL,
    token text NOT NULL,
    status public.verification_status DEFAULT 'pending'::public.verification_status NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: applications applications_opportunity_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_opportunity_id_user_id_key UNIQUE (opportunity_id, user_id);


--
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- Name: certifications certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_pkey PRIMARY KEY (id);


--
-- Name: education education_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.education
    ADD CONSTRAINT education_pkey PRIMARY KEY (id);


--
-- Name: experiences experiences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT experiences_pkey PRIMARY KEY (id);


--
-- Name: hour_logs hour_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hour_logs
    ADD CONSTRAINT hour_logs_pkey PRIMARY KEY (id);


--
-- Name: lab_profiles lab_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_profiles
    ADD CONSTRAINT lab_profiles_pkey PRIMARY KEY (id);


--
-- Name: opportunities opportunities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.opportunities
    ADD CONSTRAINT opportunities_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: saved_opportunities saved_opportunities_opportunity_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_opportunities
    ADD CONSTRAINT saved_opportunities_opportunity_id_user_id_key UNIQUE (opportunity_id, user_id);


--
-- Name: saved_opportunities saved_opportunities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_opportunities
    ADD CONSTRAINT saved_opportunities_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: verification_requests verification_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_requests
    ADD CONSTRAINT verification_requests_pkey PRIMARY KEY (id);


--
-- Name: verification_requests verification_requests_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_requests
    ADD CONSTRAINT verification_requests_token_key UNIQUE (token);


--
-- Name: idx_applications_opportunity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_applications_opportunity_id ON public.applications USING btree (opportunity_id);


--
-- Name: idx_applications_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_applications_user_id ON public.applications USING btree (user_id);


--
-- Name: idx_hour_logs_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hour_logs_date ON public.hour_logs USING btree (date DESC);


--
-- Name: idx_hour_logs_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hour_logs_user_id ON public.hour_logs USING btree (user_id);


--
-- Name: idx_hour_logs_verification_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hour_logs_verification_status ON public.hour_logs USING btree (verification_status);


--
-- Name: idx_opportunities_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_opportunities_category ON public.opportunities USING btree (category);


--
-- Name: idx_opportunities_location; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_opportunities_location ON public.opportunities USING btree (location);


--
-- Name: idx_opportunities_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_opportunities_status ON public.opportunities USING btree (status);


--
-- Name: idx_opportunities_verified; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_opportunities_verified ON public.opportunities USING btree (verified);


--
-- Name: idx_profiles_verified_pi; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_verified_pi ON public.profiles USING btree (verified) WHERE (verified = true);


--
-- Name: idx_saved_opportunities_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_saved_opportunities_user_id ON public.saved_opportunities USING btree (user_id);


--
-- Name: idx_verification_requests_hour_log_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_verification_requests_hour_log_id ON public.verification_requests USING btree (hour_log_id);


--
-- Name: idx_verification_requests_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_verification_requests_token ON public.verification_requests USING btree (token);


--
-- Name: profiles on_profile_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER on_profile_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: applications update_applications_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: certifications update_certifications_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON public.certifications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: education update_education_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON public.education FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: experiences update_experiences_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON public.experiences FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: hour_logs update_hour_logs_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_hour_logs_updated_at BEFORE UPDATE ON public.hour_logs FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: lab_profiles update_lab_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_lab_profiles_updated_at BEFORE UPDATE ON public.lab_profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: opportunities update_opportunities_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON public.opportunities FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: verification_requests update_verification_requests_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_verification_requests_updated_at BEFORE UPDATE ON public.verification_requests FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: applications applications_opportunity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_opportunity_id_fkey FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;


--
-- Name: certifications certifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: education education_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.education
    ADD CONSTRAINT education_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: experiences experiences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT experiences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: verification_requests fk_hour_log; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_requests
    ADD CONSTRAINT fk_hour_log FOREIGN KEY (hour_log_id) REFERENCES public.hour_logs(id) ON DELETE CASCADE;


--
-- Name: hour_logs fk_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hour_logs
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: opportunities opportunities_lab_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.opportunities
    ADD CONSTRAINT opportunities_lab_profile_id_fkey FOREIGN KEY (lab_profile_id) REFERENCES public.lab_profiles(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: saved_opportunities saved_opportunities_opportunity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_opportunities
    ADD CONSTRAINT saved_opportunities_opportunity_id_fkey FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_roles Admins can manage all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all roles" ON public.user_roles USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: opportunities Anyone can view active verified opportunities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active verified opportunities" ON public.opportunities FOR SELECT USING ((((status = 'active'::public.opportunity_status) AND (verified = true)) OR (EXISTS ( SELECT 1
   FROM public.lab_profiles
  WHERE ((lab_profiles.id = opportunities.lab_profile_id) AND (lab_profiles.user_id = auth.uid()))))));


--
-- Name: lab_profiles Anyone can view verified lab profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view verified lab profiles" ON public.lab_profiles FOR SELECT USING (((verified = true) OR (user_id = auth.uid())));


--
-- Name: opportunities Lab owners can create opportunities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Lab owners can create opportunities" ON public.opportunities FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.lab_profiles
  WHERE ((lab_profiles.id = opportunities.lab_profile_id) AND (lab_profiles.user_id = auth.uid())))));


--
-- Name: opportunities Lab owners can delete their opportunities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Lab owners can delete their opportunities" ON public.opportunities FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.lab_profiles
  WHERE ((lab_profiles.id = opportunities.lab_profile_id) AND (lab_profiles.user_id = auth.uid())))));


--
-- Name: applications Lab owners can update applications to their opportunities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Lab owners can update applications to their opportunities" ON public.applications FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM (public.opportunities o
     JOIN public.lab_profiles lp ON ((o.lab_profile_id = lp.id)))
  WHERE ((o.id = applications.opportunity_id) AND (lp.user_id = auth.uid())))));


--
-- Name: opportunities Lab owners can update their opportunities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Lab owners can update their opportunities" ON public.opportunities FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.lab_profiles
  WHERE ((lab_profiles.id = opportunities.lab_profile_id) AND (lab_profiles.user_id = auth.uid())))));


--
-- Name: applications Lab owners can view applications to their opportunities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Lab owners can view applications to their opportunities" ON public.applications FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (public.opportunities o
     JOIN public.lab_profiles lp ON ((o.lab_profile_id = lp.id)))
  WHERE ((o.id = applications.opportunity_id) AND (lp.user_id = auth.uid())))));


--
-- Name: verification_requests Service role can delete verification requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can delete verification requests" ON public.verification_requests FOR DELETE TO service_role USING (true);


--
-- Name: verification_requests Service role can insert verification requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can insert verification requests" ON public.verification_requests FOR INSERT TO service_role WITH CHECK (true);


--
-- Name: verification_requests Service role can update verification requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can update verification requests" ON public.verification_requests FOR UPDATE TO service_role USING (true);


--
-- Name: applications Users can create their own applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own applications" ON public.applications FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: lab_profiles Users can create their own lab profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own lab profile" ON public.lab_profiles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: certifications Users can delete their own certifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own certifications" ON public.certifications FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: education Users can delete their own education; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own education" ON public.education FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: experiences Users can delete their own experiences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own experiences" ON public.experiences FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: hour_logs Users can delete their own hour logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own hour logs" ON public.hour_logs FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: saved_opportunities Users can delete their saved opportunities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their saved opportunities" ON public.saved_opportunities FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: certifications Users can insert their own certifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own certifications" ON public.certifications FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: education Users can insert their own education; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own education" ON public.education FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: experiences Users can insert their own experiences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own experiences" ON public.experiences FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: hour_logs Users can insert their own hour logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own hour logs" ON public.hour_logs FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Users can insert their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: saved_opportunities Users can save opportunities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can save opportunities" ON public.saved_opportunities FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: applications Users can update their own applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own applications" ON public.applications FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: certifications Users can update their own certifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own certifications" ON public.certifications FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: education Users can update their own education; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own education" ON public.education FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: experiences Users can update their own experiences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own experiences" ON public.experiences FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: hour_logs Users can update their own hour logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own hour logs" ON public.hour_logs FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: lab_profiles Users can update their own lab profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own lab profile" ON public.lab_profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: certifications Users can view all certifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view all certifications" ON public.certifications FOR SELECT USING (true);


--
-- Name: education Users can view all education; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view all education" ON public.education FOR SELECT USING (true);


--
-- Name: experiences Users can view all experiences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view all experiences" ON public.experiences FOR SELECT USING (true);


--
-- Name: profiles Users can view public profile information; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view public profile information" ON public.profiles FOR SELECT TO authenticated USING (((auth.uid() <> id) AND true));


--
-- Name: applications Users can view their own applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own applications" ON public.applications FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view their own full profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own full profile" ON public.profiles FOR SELECT TO authenticated USING ((auth.uid() = id));


--
-- Name: hour_logs Users can view their own hour logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own hour logs" ON public.hour_logs FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: saved_opportunities Users can view their own saved opportunities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own saved opportunities" ON public.saved_opportunities FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: verification_requests Users can view their own verification requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own verification requests" ON public.verification_requests FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.hour_logs
  WHERE ((hour_logs.id = verification_requests.hour_log_id) AND (hour_logs.user_id = auth.uid())))));


--
-- Name: applications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

--
-- Name: certifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

--
-- Name: education; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

--
-- Name: experiences; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

--
-- Name: hour_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.hour_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: lab_profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.lab_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: opportunities; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: saved_opportunities; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: verification_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


